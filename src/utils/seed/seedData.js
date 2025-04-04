const mongoose = require('mongoose');
const Course = require('../../models/Course');
const Blog = require('../../models/Blog');
const CourseCategory = require('../../models/CourseCategory');
const BlogCategory = require('../../models/BlogCategory');
const Media = require('../../models/Media');
require('dotenv').config();

// Sample media data with placeholder images
const mediaItems = [
  {
    title: 'Consultative Selling Image',
    file_name: 'consultative-selling.jpg',
    file_type: 'image/jpeg',
    mime_type: 'image/jpeg',
    media_type: 'image',
    file_size: 12345,
    file_url: 'https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling',
    alt_text: 'Consultative Selling Cover Image',
    description: 'Cover image for Consultative Selling course',
    upload_by: new mongoose.Types.ObjectId('000000000000000000000001'),
    dimensions: {
      width: 600,
      height: 400
    }
  },
  {
    title: 'Objection Handling Image',
    file_name: 'objection-handling.jpg',
    file_type: 'image/jpeg',
    mime_type: 'image/jpeg',
    media_type: 'image',
    file_size: 23456,
    file_url: 'https://placehold.co/600x400/111827/6B7280?text=Objection+Handling',
    alt_text: 'Objection Handling Cover Image',
    description: 'Cover image for Objection Handling course',
    upload_by: new mongoose.Types.ObjectId('000000000000000000000001'),
    dimensions: {
      width: 600,
      height: 400
    }
  },
  {
    title: 'Sales Psychology Image',
    file_name: 'sales-psychology.jpg',
    file_type: 'image/jpeg',
    mime_type: 'image/jpeg',
    media_type: 'image',
    file_size: 34567,
    file_url: 'https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology',
    alt_text: 'Sales Psychology Cover Image',
    description: 'Cover image for Sales Psychology blog',
    upload_by: new mongoose.Types.ObjectId('000000000000000000000001'),
    dimensions: {
      width: 600,
      height: 400
    }
  },
  {
    title: 'Closing Techniques Image',
    file_name: 'closing-techniques.jpg',
    file_type: 'image/jpeg',
    mime_type: 'image/jpeg',
    media_type: 'image',
    file_size: 45678,
    file_url: 'https://placehold.co/600x400/111827/6B7280?text=Closing+Techniques',
    alt_text: 'Closing Techniques Cover Image',
    description: 'Cover image for Closing Techniques blog',
    upload_by: new mongoose.Types.ObjectId('000000000000000000000001'),
    dimensions: {
      width: 600,
      height: 400
    }
  },
  {
    title: 'Enterprise Sales Image',
    file_name: 'enterprise-sales.jpg',
    file_type: 'image/jpeg',
    mime_type: 'image/jpeg',
    media_type: 'image',
    file_size: 56789,
    file_url: 'https://placehold.co/600x400/111827/6B7280?text=Enterprise+Sales',
    alt_text: 'Enterprise Sales Cover Image',
    description: 'Cover image for Enterprise Sales',
    upload_by: new mongoose.Types.ObjectId('000000000000000000000001'),
    dimensions: {
      width: 600,
      height: 400
    }
  }
];

// Sample blog categories
const blogCategories = [
  {
    name: 'Sales Psychology',
    slug: 'sales-psychology'
  },
  {
    name: 'Sales Techniques',
    slug: 'sales-techniques'
  },
  {
    name: 'Closing Strategies',
    slug: 'closing-strategies'
  },
  {
    name: 'Negotiation',
    slug: 'negotiation'
  },
  {
    name: 'Cold Calling',
    slug: 'cold-calling'
  }
];

// Sample course categories
const courseCategories = [
  {
    name: 'Sales Skills',
    slug: 'sales-skills'
  },
  {
    name: 'Consultative Selling',
    slug: 'consultative-selling'
  },
  {
    name: 'Enterprise Sales',
    slug: 'enterprise-sales'
  },
  {
    name: 'Objection Handling',
    slug: 'objection-handling'
  },
  {
    name: 'Relationship Building',
    slug: 'relationship-building'
  }
];

// Sample blogs
const blogs = [
  {
    id: "psychological-triggers-sales",
    title: "7 Psychological Triggers That Drive High-Value Sales",
    excerpt: "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology",
    author: "Michael Carson",
    date: "Feb 12, 2024",
    htmlContent: `
      <h2>Introduction</h2>
      <p>In the competitive world of sales, understanding human psychology gives you a significant advantage. By recognizing what drives customer decisions, you can position your offerings more effectively and close high-value deals more consistently.</p>
      <p>The most successful sales professionals don't rely on manipulation or pressure tactics. Instead, they leverage fundamental psychological principles to create win-win situations that genuinely benefit their customers while achieving their sales objectives.</p>
      
      <h2>1. Reciprocity: The Power of Giving First</h2>
      <p>Reciprocity is one of the most powerful psychological triggers in human interaction. When someone gives us something of value, we feel naturally obligated to return the favor.</p>
      <p>In sales, this principle can be applied by offering genuine value upfront: sharing useful insights, providing free resources, or extending special considerations that demonstrate your commitment to the prospect's success.</p>
      
      <h2>2. Social Proof: Leveraging the Wisdom of the Crowd</h2>
      <p>Humans are inherently social creatures who look to others for guidance on how to act, especially in uncertain situations. When prospects see that others similar to them have made a purchase decision, they feel more confident doing the same.</p>
      <p>Incorporate testimonials, case studies, and specific results from similar clients to activate this trigger. The more closely these examples match your prospect's situation, the more powerful the social proof becomes.</p>
      
      <h2>Conclusion</h2>
      <p>By understanding and ethically applying these seven psychological triggers, you can create more effective sales conversations that resonate deeply with prospects. These principles work because they align with fundamental aspects of human decision-making.</p>
      <p>Remember that the ultimate goal isn't just to close a sale, but to create value for your customers in ways that lead to lasting relationships and positive outcomes for all parties involved.</p>
    `,
    content: [
      {
        heading: "Introduction",
        paragraphs: [
          "In the competitive world of sales, understanding human psychology gives you a significant advantage. By recognizing what drives customer decisions, you can position your offerings more effectively and close high-value deals more consistently.",
          "The most successful sales professionals don't rely on manipulation or pressure tactics. Instead, they leverage fundamental psychological principles to create win-win situations that genuinely benefit their customers while achieving their sales objectives."
        ]
      },
      {
        heading: "1. Reciprocity: The Power of Giving First",
        paragraphs: [
          "Reciprocity is one of the most powerful psychological triggers in human interaction. When someone gives us something of value, we feel naturally obligated to return the favor.",
          "In sales, this principle can be applied by offering genuine value upfront: sharing useful insights, providing free resources, or extending special considerations that demonstrate your commitment to the prospect's success."
        ]
      },
      {
        heading: "2. Social Proof: Leveraging the Wisdom of the Crowd",
        paragraphs: [
          "Humans are inherently social creatures who look to others for guidance on how to act, especially in uncertain situations. When prospects see that others similar to them have made a purchase decision, they feel more confident doing the same.",
          "Incorporate testimonials, case studies, and specific results from similar clients to activate this trigger. The more closely these examples match your prospect's situation, the more powerful the social proof becomes."
        ]
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "By understanding and ethically applying these seven psychological triggers, you can create more effective sales conversations that resonate deeply with prospects. These principles work because they align with fundamental aspects of human decision-making.",
          "Remember that the ultimate goal isn't just to close a sale, but to create value for your customers in ways that lead to lasting relationships and positive outcomes for all parties involved."
        ]
      }
    ]
  },
  {
    id: "closing-techniques-modern-sales",
    title: "5 Modern Closing Techniques That Actually Work",
    excerpt: "Discover non-pushy approaches to closing that align with today's informed, sophisticated buyers and help establish long-term relationships.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Closing+Techniques",
    author: "Sarah Johnson",
    date: "Mar 3, 2024",
    htmlContent: `
      <h2>Introduction</h2>
      <p>The days of aggressive, high-pressure closing tactics are behind us. Modern buyers come to the table informed, skeptical of manipulation, and looking for advisors rather than vendors.</p>
      <p>Today's most effective closing techniques focus on collaboration, creating value, and ensuring alignment between the solution and the customer's needs. This shift represents not just a change in tactics, but a fundamentally different philosophy about the sales profession.</p>
      
      <h2>1. The Summary Close</h2>
      <p>This straightforward technique involves summarizing all the points of agreement you've reached during your discussions, along with the specific ways your solution addresses the prospect's key challenges.</p>
      <p>The power of this approach lies in helping the prospect connect the dots between their needs and your solution, while giving them space to make their own decision rather than feeling pressured.</p>
      
      <h2>2. The Question Close</h2>
      <p>Instead of making declarative statements, skillful questions can guide prospects toward their own conclusions about the value of moving forward.</p>
      <p>Questions like 'Based on what we've discussed, do you see how this solution addresses your three main concerns?' or 'What would implementation look like on your end if we were to move forward?' help prospects visualize the positive outcomes of saying yes.</p>
      
      <h2>Conclusion</h2>
      <p>The common thread among these modern closing techniques is respect for the prospect's autonomy and intelligence. Rather than manipulating or pressuring, these approaches focus on creating clarity, demonstrating value, and facilitating good decisions.</p>
      <p>By adopting these consultative closing methods, you'll not only win more business but also build the foundation for long-term client relationships based on trust and mutual value.</p>
    `,
    content: [
      {
        heading: "Introduction",
        paragraphs: [
          "The days of aggressive, high-pressure closing tactics are behind us. Modern buyers come to the table informed, skeptical of manipulation, and looking for advisors rather than vendors.",
          "Today's most effective closing techniques focus on collaboration, creating value, and ensuring alignment between the solution and the customer's needs. This shift represents not just a change in tactics, but a fundamentally different philosophy about the sales profession."
        ]
      },
      {
        heading: "1. The Summary Close",
        paragraphs: [
          "This straightforward technique involves summarizing all the points of agreement you've reached during your discussions, along with the specific ways your solution addresses the prospect's key challenges.",
          "The power of this approach lies in helping the prospect connect the dots between their needs and your solution, while giving them space to make their own decision rather than feeling pressured."
        ]
      },
      {
        heading: "2. The Question Close",
        paragraphs: [
          "Instead of making declarative statements, skillful questions can guide prospects toward their own conclusions about the value of moving forward.",
          "Questions like 'Based on what we've discussed, do you see how this solution addresses your three main concerns?' or 'What would implementation look like on your end if we were to move forward?' help prospects visualize the positive outcomes of saying yes."
        ]
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "The common thread among these modern closing techniques is respect for the prospect's autonomy and intelligence. Rather than manipulating or pressuring, these approaches focus on creating clarity, demonstrating value, and facilitating good decisions.",
          "By adopting these consultative closing methods, you'll not only win more business but also build the foundation for long-term client relationships based on trust and mutual value."
        ]
      }
    ]
  },
  {
    id: "navigating-multi-level-decisions",
    title: "Navigating Multi-Level Decision Making in Complex Sales",
    excerpt: "Learn effective strategies for mapping decision-making processes, identifying key stakeholders, and building consensus in complex B2B sales scenarios.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Complex+Sales",
    author: "Robert Chen",
    date: "Jan 17, 2024",
    htmlContent: `
      <h2>Introduction</h2>
      <p>Complex B2B sales rarely involve a single decision-maker. Instead, they typically require navigating a network of stakeholders, each with different priorities, concerns, and levels of influence.</p>
      <p>Success in these environments depends not just on the strength of your solution, but on your ability to map the decision process, identify key players, and build consensus across multiple organizational levels.</p>
      
      <h2>Understanding Decision Matrices</h2>
      <p>Every organization has its own unique decision-making structure. Some follow formal, hierarchical processes, while others operate through consensus-building across departments.</p>
      <p>Your first task is to uncover how decisions are actually made within the specific organization you're selling to, which often differs from what's shown on the organizational chart.</p>
      
      <h2>Identifying Stakeholder Types</h2>
      <p>Not all stakeholders are created equal. Your success depends on identifying and understanding the different roles people play in the decision process.</p>
      <p>Key types include economic buyers (who control budget), technical evaluators (who assess capabilities), end users (who will work with your solution), and champions (who advocate for you internally).</p>
      
      <h2>Conclusion</h2>
      <p>Navigating multi-level decision processes requires patience, strategic thinking, and excellent relationship management skills. The complexity of these sales environments is precisely why they often come with higher values and greater rewards.</p>
      <p>By mapping the decision landscape, engaging stakeholders effectively, building consensus, and arming your internal champions, you can successfully guide complex opportunities to closure even when multiple decision-makers are involved.</p>
    `,
    content: [
      {
        heading: "Introduction",
        paragraphs: [
          "Complex B2B sales rarely involve a single decision-maker. Instead, they typically require navigating a network of stakeholders, each with different priorities, concerns, and levels of influence.",
          "Success in these environments depends not just on the strength of your solution, but on your ability to map the decision process, identify key players, and build consensus across multiple organizational levels."
        ]
      },
      {
        heading: "Understanding Decision Matrices",
        paragraphs: [
          "Every organization has its own unique decision-making structure. Some follow formal, hierarchical processes, while others operate through consensus-building across departments.",
          "Your first task is to uncover how decisions are actually made within the specific organization you're selling to, which often differs from what's shown on the organizational chart."
        ]
      },
      {
        heading: "Identifying Stakeholder Types",
        paragraphs: [
          "Not all stakeholders are created equal. Your success depends on identifying and understanding the different roles people play in the decision process.",
          "Key types include economic buyers (who control budget), technical evaluators (who assess capabilities), end users (who will work with your solution), and champions (who advocate for you internally)."
        ]
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "Navigating multi-level decision processes requires patience, strategic thinking, and excellent relationship management skills. The complexity of these sales environments is precisely why they often come with higher values and greater rewards.",
          "By mapping the decision landscape, engaging stakeholders effectively, building consensus, and arming your internal champions, you can successfully guide complex opportunities to closure even when multiple decision-makers are involved."
        ]
      }
    ]
  }
];

// Sample courses
const courses = [
  {
    id: "fundamentals-consultative-selling",
    title: "Fundamentals of Consultative Selling",
    description: "Learn the core principles of consultative selling and how to build meaningful client relationships based on trust.",
    longDescription: "This comprehensive course will teach you the fundamentals of consultative selling, a powerful approach that focuses on building relationships and solving client problems rather than pushing products. Developed by industry experts with years of experience, this course combines theoretical knowledge with practical exercises to help you master the art of consultative selling. By the end of this course, you'll have a solid foundation in key consultative selling techniques and be able to apply them in your daily sales activities.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling",
    level: "Beginner",
    duration: "4 hours",
    modules: 5,
    learningOutcomes: [
      "Understand the core principles of consultative selling",
      "Develop active listening and questioning techniques",
      "Build trust and rapport with prospects and clients",
      "Identify client needs and pain points effectively",
      "Create customized solutions that address specific challenges",
      "Handle objections with confidence and empathy"
    ],
    moduleDetails: [
      {
        title: "Introduction to Consultative Selling",
        duration: "45 minutes"
      },
      {
        title: "Building Rapport and Trust",
        duration: "50 minutes"
      },
      {
        title: "Effective Questioning Techniques",
        duration: "55 minutes"
      },
      {
        title: "Presenting Customized Solutions",
        duration: "50 minutes"
      },
      {
        title: "Mastering Follow-up and Relationship Building",
        duration: "40 minutes"
      }
    ]
  },
  {
    id: "advanced-objection-handling",
    title: "Advanced Objection Handling",
    description: "Master sophisticated techniques for handling complex objections and turning resistance into commitment.",
    longDescription: "This advanced course takes your objection handling skills to the next level. You'll learn how to anticipate objections before they arise, respond confidently to even the most challenging customer concerns, and transform potential roadblocks into opportunities to strengthen your relationship with the prospect. Designed for experienced sales professionals who want to elevate their expertise, this course combines advanced theory with real-world scenarios drawn from high-stakes enterprise sales environments.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Objection+Handling",
    level: "Advanced",
    duration: "5 hours",
    modules: 6,
    learningOutcomes: [
      "Anticipate and prevent common objections before they arise",
      "Recognize underlying concerns behind stated objections",
      "Respond confidently to price and value objections",
      "Handle stalls and delays strategically",
      "Address objections in competitive sales situations",
      "Convert objections into opportunities to strengthen your proposal"
    ],
    moduleDetails: [
      {
        title: "Understanding the Psychology of Objections",
        duration: "50 minutes"
      },
      {
        title: "Anticipation and Prevention Strategies",
        duration: "45 minutes"
      },
      {
        title: "Mastering Value and Price Objections",
        duration: "55 minutes"
      },
      {
        title: "Handling Competitive Objections",
        duration: "50 minutes"
      },
      {
        title: "Addressing Timing and Authority Issues",
        duration: "45 minutes"
      },
      {
        title: "Converting Objections into Commitment",
        duration: "55 minutes"
      }
    ]
  },
  {
    id: "enterprise-sales-mastery",
    title: "Enterprise Sales Mastery",
    description: "Learn proven strategies for navigating complex enterprise sales cycles and securing high-value deals.",
    longDescription: "This comprehensive course equips sales professionals with the specialized skills needed to succeed in complex, high-value enterprise sales environments. You'll learn how to navigate multilayered decision-making processes, build consensus among diverse stakeholders, and develop compelling value propositions that resonate with C-suite executives. Drawing on decades of enterprise sales experience, this course provides a structured framework for approaching each stage of the enterprise sales cycle with confidence and expertise.",
    image: "https://placehold.co/600x400/111827/6B7280?text=Enterprise+Sales",
    level: "Intermediate",
    duration: "8 hours",
    modules: 7,
    learningOutcomes: [
      "Map and navigate complex organizational structures",
      "Identify and engage multiple decision-makers and influencers",
      "Develop compelling business cases that demonstrate ROI",
      "Execute effective discovery across organizational levels",
      "Create and communicate tailored value propositions",
      "Build consensus among diverse stakeholders",
      "Negotiate and close high-value enterprise deals"
    ],
    moduleDetails: [
      {
        title: "Understanding the Enterprise Sales Landscape",
        duration: "60 minutes"
      },
      {
        title: "Organizational Mapping and Stakeholder Analysis",
        duration: "70 minutes"
      },
      {
        title: "Enterprise Discovery Techniques",
        duration: "75 minutes"
      },
      {
        title: "Building Compelling Business Cases",
        duration: "65 minutes"
      },
      {
        title: "Consensus Building Strategies",
        duration: "70 minutes"
      },
      {
        title: "Enterprise Proposal Development",
        duration: "60 minutes"
      },
      {
        title: "Negotiating and Closing Complex Deals",
        duration: "80 minutes"
      }
    ]
  }
];

async function seedCoursesAndBlogs() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const companyId = new mongoose.Types.ObjectId(process.env.DEFAULT_COMPANY_ID || '000000000000000000000000');

    // Seed media
    console.log('Seeding media...');
    await Media.deleteMany({}); // Remove existing media
    const createdMedia = await Media.insertMany(mediaItems.map(item => ({
      ...item,
      company_id: companyId
    })));
    console.log(`${createdMedia.length} media items seeded successfully`);

    // Seed blog categories
    console.log('Seeding blog categories...');
    await BlogCategory.deleteMany({}); // Remove existing blog categories
    const createdBlogCategories = await BlogCategory.insertMany(blogCategories.map(category => ({
      ...category,
      company_id: companyId
    })));
    console.log(`${createdBlogCategories.length} blog categories seeded successfully`);

    // Seed course categories
    console.log('Seeding course categories...');
    await CourseCategory.deleteMany({}); // Remove existing course categories
    const createdCourseCategories = await CourseCategory.insertMany(courseCategories.map(category => ({
      ...category,
      company_id: companyId
    })));
    console.log(`${createdCourseCategories.length} course categories seeded successfully`);

    // Map category names to IDs for blogs
    const blogCategoryMap = {};
    createdBlogCategories.forEach(category => {
      blogCategoryMap[category.name] = category._id;
    });

    // Map category names to IDs for courses
    const courseCategoryMap = {};
    createdCourseCategories.forEach(category => {
      courseCategoryMap[category.name] = category._id;
    });

    // Seed blogs with proper category references
    console.log('Seeding blogs...');
    await Blog.deleteMany({}); // Remove existing blogs
    
    // Assign categories to blogs
    const blogsWithCategories = blogs.map(blog => {
      let categories = [];
      
      // Assign categories based on content
      if (blog.id === "psychological-triggers-sales") {
        categories = [blogCategoryMap["Sales Psychology"]];
      } else if (blog.id === "closing-techniques-modern-sales") {
        categories = [blogCategoryMap["Closing Strategies"], blogCategoryMap["Sales Techniques"]];
      } else if (blog.id === "navigating-multi-level-decisions") {
        categories = [blogCategoryMap["Enterprise Sales"], blogCategoryMap["Sales Techniques"]];
      }
      
      return {
        ...blog,
        categories,
        company_id: companyId
      };
    });
    
    const createdBlogs = await Blog.insertMany(blogsWithCategories);
    console.log(`${createdBlogs.length} blogs seeded successfully`);

    // Seed courses with proper category references
    console.log('Seeding courses...');
    await Course.deleteMany({}); // Remove existing courses
    
    // Assign categories to courses
    const coursesWithCategories = courses.map(course => {
      let categories = [];
      
      // Assign categories based on content
      if (course.id === "fundamentals-consultative-selling") {
        categories = [courseCategoryMap["Consultative Selling"], courseCategoryMap["Sales Skills"]];
      } else if (course.id === "advanced-objection-handling") {
        categories = [courseCategoryMap["Objection Handling"], courseCategoryMap["Sales Skills"]];
      } else if (course.id === "enterprise-sales-mastery") {
        categories = [courseCategoryMap["Enterprise Sales"], courseCategoryMap["Relationship Building"]];
      }
      
      return {
        ...course,
        categories,
        company_id: companyId
      };
    });
    
    const createdCourses = await Course.insertMany(coursesWithCategories);
    console.log(`${createdCourses.length} courses seeded successfully`);

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedCoursesAndBlogs(); 