const course = require('../models/courseModel');
const users = require('../models/userModel');
const enrollments = require('../models/enrollmentModel');
const stripe = require('stripe')('sk_test_51SPbdoDHLUbAabhFX2bsI5tgjBDmJc0WbqkZ4k9zMimaJoLk78T4p3vMkB4ufXmjJNE5JKwIcRbifFswAMzdLI5A00OAnyNaxv')

exports.addCourseController = async (req, res) => {
    console.log("Inside addCourseController");

    // console.log(req.body);
    // console.log(req.files);

    const { courseType, courseTitle, courseDescription, price } = req.body
    const modules = JSON.parse(req.body.modules);
    const userMail = req.payload
    const thumbnail = req.files['thumbnail']?.[0]?.path;
    const videoFiles = req.files['videoUrl'] || [];
    const pdfFiles = req.files['fileUrl'] || [];
    // console.log(courseTitle,courseDescription,price,thumbnail,modules,videoFiles,pdfFiles);

    modules.forEach((mod, i) => {
        mod.videos = [{ videotitle: mod.videos[0].videotitle, videoUrl: videoFiles[i]?.path }];
        mod.pdfs = [{ pdftitle: mod.pdfs[0].pdftitle, fileUrl: pdfFiles[i]?.path }];
    });

    console.log(courseType, courseTitle, courseDescription, price, thumbnail, modules, userMail);


    console.log(JSON.stringify(modules, null, 2));

    try {

        const existingCourse = await course.findOne({ courseTitle, userMail })
        if (existingCourse) {
            res.status(401).json("You have already added the Course")
        } else {
            const newCourse = new course({
                courseType, courseTitle, courseDescription, price, thumbnail, modules, userMail
            })
            await newCourse.save()
            res.status(200).json(newCourse)
        }


    }
    catch (err) {
        res.status(500).json(err)
    }





}

exports.getHomeCourses = async (req, res) => {
    console.log("Inside getHomeBooks");
    try {
        const allHomeCourses = await course.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeCourses)
    }
    catch (err) {
        res.status(500).json(err)
    }

}

exports.getAllCoursesController = async (req, res) => {
    console.log("Inside getAllCourses");
    const searchKey = req.query.search


    const email = req.payload
    const query = {
        courseTitle: { $regex: searchKey, $options: 'i' },

    }
    try {

        const allCourses = await course.find(query)
        res.status(200).json(allCourses)

    } catch (err) {
        res.status(500).json(err)
    }
}
exports.viewCourseController = async (req, res) => {
    console.log("Inside viewCourseController");
    const { id } = req.params
    console.log(id);
    try {
        const viewCourse = await course.findById({ _id: id })
        res.status(200).json(viewCourse)
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.makeBookPaymentController = async (req, res) => {
    console.log("Inside makeBookPaymentController");
    const { _id, courseType, courseTitle, courseDescription, price, thumbnail, modules, userMail } = req.body;
    console.log(_id, courseType, courseTitle, courseDescription, price, thumbnail, modules, userMail);



    const uId = req.id; // assuming user id comes from token
    const email = req.payload
    console.log(uId);
    console.log(email);


    // Step 1️⃣: Find course and user
    

    try {
        const userDoc = await users.findById(uId);
    const courseDoc = await course.findById(_id);

    if (!userDoc || !courseDoc) {
        return res.status(404).json({ message: 'User or Course not found' });
    }

    const alreadyEnrolled = await enrollments.findOne({ userId: uId, courseId: _id });
    if (alreadyEnrolled) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
    }


        //stripe checkout session.
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: courseTitle,
                    description: `${courseType} | ${courseTitle}`,
                     metadata: {
                        courseId: _id, courseType, courseTitle, courseDescription, coursePrice: price, thumbnail, userMail,
                        userId: uId,
                        userEmail: email,



                    }
                    
                },
                unit_amount: Math.round(price * 100)

            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            success_url:"http://localhost:5174/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url:"http://localhost:5174/payment-error",
            metadata: {
    courseId: _id,
    courseTitle,
    coursePrice: price,
    userId: uId,
    userEmail: email
  }


        });
        console.log("Stripe Session created:", session.id);
        console.log(session);
        res.status(200).json({ checkoutSessionURL: session.url })



    } catch (err) {
        console.error("Stripe payment error:", err.message);
        res.status(500).json(err)
    }


}
exports.verifyPaymentAndEnroll = async (req, res) => {
    console.log("verifyPaymentAndEnroll");
    
    try {
        const { session_id } = req.query;

        // 1️⃣ Retrieve session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log(session);
        console.log(session.metadata);
        
        

        // 2️⃣ Extract metadata you stored earlier
        const { courseId,  courseTitle,  coursePrice,   userId, userEmail, } = session.metadata;
        console.log(courseId,  courseTitle,  coursePrice,   userId, userEmail);
        

        // 3️⃣ Double-check payment status
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not completed' });
        }

        // 4️⃣ Prevent duplicate enrollment
        const alreadyEnrolled = await enrollments.findOne({ userId, courseId });
        if (alreadyEnrolled) {
            res.status(400).json({ message: 'Already enrolled' });
        } else {
            // 5️⃣ Create new enrollment
            const newEnrollment = new enrollments({
                userId,
                userEmail,
                courseId,
                courseTitle,
                coursePrice,
                
            });
            await newEnrollment.save();

            res.status(200).json({ message: 'Enrollment successful', newEnrollment });

        }





    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllEnrollments = async (req, res) => {
    console.log("getAllEnrollments");
    
  try {
    const enrollmentsDetails = await enrollments.find()
      .populate('userId', 'username email')
      .populate('courseId', 'courseTitle price');

    res.status(200).json(enrollmentsDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCourseStats = async (req, res) => {
  try {
    const stats = await enrollments.aggregate([
      {
        $group: {
          _id: "$courseId",
          courseTitle: { $first: "$courseTitle" },
          totalStudents: { $sum: 1 },
          totalEarnings: { $sum: "$coursePrice" }
        }
      },
      { $sort: { totalEarnings: -1 } }
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



