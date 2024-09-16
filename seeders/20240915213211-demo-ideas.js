'use strict';
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ideas = [
      {
        title: 'Revolutionizing Education with AI',
        description: 'An AI-powered platform that tailors learning experiences based on individual student needs.',
        tags: '#education #AI #innovation',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Sustainable Energy for Urban Areas',
        description: 'A solution to integrate solar panels into urban infrastructure to power city blocks.',
        tags: '#energy #sustainability #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Blockchain-based Voting System',
        description: 'A secure and transparent voting platform that ensures election integrity using blockchain.',
        tags: '#blockchain #voting #security',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Affordable 3D-Printed Housing',
        description: 'A project focused on providing affordable housing solutions using 3D printing technology.',
        tags: '#housing #3Dprinting #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'A Smart Waste Management System',
        description: 'A network of IoT-enabled bins that automatically notify waste collection services when full.',
        tags: '#IoT #waste #smartcities',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mental Health Support App',
        description: 'A mobile app providing personalized mental health advice and virtual therapy sessions.',
        tags: '#mentalhealth #wellness #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Autonomous Delivery Robots',
        description: 'A fleet of autonomous robots designed to deliver groceries and packages to customers.',
        tags: '#robotics #delivery #AI',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Virtual Reality for Remote Work',
        description: 'A VR solution enabling teams to work together in a shared virtual office space.',
        tags: '#VR #remotework #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-driven Healthcare Diagnostics',
        description: 'A machine learning tool that helps doctors diagnose diseases faster and more accurately.',
        tags: '#healthcare #AI #machinelearning',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Electric Car Charging Network',
        description: 'A network of smart, solar-powered charging stations for electric vehicles.',
        tags: '#electriccars #sustainability #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Personalized Fitness Plans Using AI',
        description: 'An AI platform that creates fitness plans based on your specific body metrics and goals.',
        tags: '#fitness #AI #health',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Eco-friendly Fashion Line',
        description: 'A sustainable fashion brand that uses recycled materials to produce stylish clothing.',
        tags: '#fashion #sustainability #eco',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Smart Home Automation System',
        description: 'A system that connects and automates your home appliances for energy savings and convenience.',
        tags: '#smarthome #IoT #automation',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-powered Marketing Tool',
        description: 'An AI tool that helps companies create targeted marketing campaigns based on user behavior.',
        tags: '#marketing #AI #business',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Augmented Reality Shopping',
        description: 'A shopping platform that allows users to try on clothes and accessories in AR before purchasing.',
        tags: '#AR #shopping #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Online Language Learning Platform',
        description: 'An interactive platform for learning new languages through video lessons and practice sessions.',
        tags: '#education #languages #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-powered Job Matching',
        description: 'A job platform that uses AI to match job seekers with the perfect job opportunities.',
        tags: '#jobs #AI #careers',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Blockchain for Supply Chain Transparency',
        description: 'A blockchain platform that ensures transparency and traceability in supply chains.',
        tags: '#blockchain #supplychain #business',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Crowdsourced Data Platform',
        description: 'A platform that collects and analyzes crowdsourced data for various industries.',
        tags: '#data #crowdsourcing #tech',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI Music Composition Tool',
        description: 'A tool that uses AI to help musicians compose original music faster and more creatively.',
        tags: '#music #AI #creativity',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'E-learning for Professionals',
        description: 'An online learning platform offering courses and certifications for professional development.',
        tags: '#elearning #professionals #education',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Virtual Reality Travel Experiences',
        description: 'A VR platform that allows users to experience destinations around the world from their home.',
        tags: '#VR #travel #experiences',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Smart Agriculture',
        description: 'A network of sensors and AI systems to monitor and optimize farm productivity.',
        tags: '#agriculture #AI #sustainability',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Wearable Fitness Tracker with AI',
        description: 'A wearable device that tracks fitness metrics and offers real-time AI-based coaching.',
        tags: '#wearable #fitness #AI',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Subscription Box for Eco-friendly Products',
        description: 'A monthly subscription service delivering eco-friendly products to your door.',
        tags: '#eco #products #business',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-driven Content Creation Platform',
        description: 'A platform that helps businesses automate the creation of high-quality content using AI.',
        tags: '#content #AI #automation',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Telemedicine Platform for Rural Areas',
        description: 'A telemedicine solution that connects rural patients with doctors remotely.',
        tags: '#telemedicine #rural #healthcare',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Green Transportation Network',
        description: 'A network of electric public transportation for urban areas to reduce pollution.',
        tags: '#transportation #green #sustainability',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-powered Fraud Detection',
        description: 'A tool that uses AI to detect and prevent fraud in financial systems.',
        tags: '#fraud #AI #finance',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'AI-based Personal Finance Advisor',
        description: 'An AI-powered app that helps users manage their personal finances and investments.',
        tags: '#finance #AI #advisor',
        likes: 0,
        userId: getRandomInt(1, 16),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('ideas', ideas, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ideas', null, {});
  }
};
