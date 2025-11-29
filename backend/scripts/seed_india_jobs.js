import dotenv from 'dotenv'
import connectDB from '../utils/db.js'
import { Company } from '../models/company.model.js'
import { Job } from '../models/job.model.js'
import { User } from '../models/user.model.js'

dotenv.config();

const jobTitles = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Product Manager', 'Data Scientist',
  'DevOps Engineer', 'QA Engineer', 'UI/UX Designer', 'Mobile Developer', 'Technical Lead',
  'Site Reliability Engineer', 'Security Engineer', 'Business Analyst', 'Support Engineer', 'Marketing Manager'
]

const indianCities = ['Bengaluru, India','Mumbai, India','New Delhi, India','Hyderabad, India','Chennai, India','Pune, India','Kolkata, India','Gurgaon, India','Noida, India','Ahmedabad, India','Jaipur, India','Lucknow, India']
const jobTypes = ['Full-time','Part-time','Contract','Internship','Remote']
const reqPool = [
  'Strong communication skills', '2+ years experience', 'Proficiency in JavaScript', 'Familiarity with React',
  'Experience with Node.js', 'Knowledge of REST APIs', 'Experience with MongoDB', 'Unit testing experience'
]

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedIndiaJobs() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Remove all existing jobs
    const del = await Job.deleteMany({});
    console.log(`Deleted ${del.deletedCount || 0} existing jobs`);

    // Find companies to attach jobs to
    let companies = await Company.find({}).limit(100).exec();

    // If no companies exist, create a few default companies so jobs can be linked
    if (!companies || companies.length === 0) {
      console.log('No companies found. Creating 5 fallback companies...');
      // find a recruiter to be the owner (or create a fallback user)
      let recruiter = await User.findOne({ role: 'recruiter' });
      if (!recruiter) {
        recruiter = await User.create({
          fullname: 'Seed Recruiter',
          email: 'seed.recruiter@seed.local',
          phoneNumber: 9000000000,
          password: 'seed',
          role: 'recruiter',
          profile: { bio: 'Seeder', skills: [], profilePhoto: '' }
        });
      }
      const fallbackCompanies = [];
      for (let i = 1; i <= 5; i++) {
        const c = await Company.create({
          name: `Seed Company ${i}`,
          description: `Seed Company ${i} description`,
          website: `https://seedcompany${i}.local`,
          location: rand(indianCities),
          logo: `https://picsum.photos/seed/seedcompany${i}/120/120`,
          userId: recruiter._id
        });
        fallbackCompanies.push(c);
      }
      companies = fallbackCompanies;
    }

    // pick some recruiters for created_by if available
    const recruiters = await User.find({ role: 'recruiter' }).limit(50).exec();

    const jobsToInsert = [];
    for (let i = 1; i <= 25; i++) {
      const company = companies[(i - 1) % companies.length];
      const title = `${rand(jobTitles)} ${i}`;
      const description = `${company.name} is hiring a ${title} to join our India team.`;
      const requirements = [];
      const reqCount = randomInt(2, 5);
      for (let r = 0; r < reqCount; r++) requirements.push(rand(reqPool));
      const salary = randomInt(300000, 3000000); // in INR per year approximate
      const experienceLevel = randomInt(0, 8);
      const location = rand(indianCities);
      const jobType = rand(jobTypes);
      const position = randomInt(1, 5);
      const created_by = (company.userId) ? company.userId : (recruiters.length ? rand(recruiters)._id : null);

      const job = {
        title,
        description,
        requirements,
        salary,
        experienceLevel,
        location,
        jobType,
        position,
        company: company._id,
        created_by,
        applications: []
      };
      jobsToInsert.push(job);
    }

    const inserted = await Job.insertMany(jobsToInsert);
    console.log(`Inserted ${inserted.length} India-based jobs.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding India jobs', error);
    process.exit(1);
  }
}

seedIndiaJobs();
