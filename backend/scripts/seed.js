import dotenv from 'dotenv'
import connectDB from '../utils/db.js'
import { User } from '../models/user.model.js'
import { Company } from '../models/company.model.js'
import { Job } from '../models/job.model.js'
import bcrypt from 'bcryptjs'

dotenv.config();

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const companyNameParts = {
  adjectives: ['Bright', 'Green', 'Blue', 'Crimson', 'Velocity', 'Apex', 'Quantum', 'Nimble', 'Sage', 'Lumina', 'Pioneer', 'Summit', 'Nova', 'Next', 'Core'],
  nouns: ['Labs', 'Systems', 'Solutions', 'Works', 'Studios', 'Dynamics', 'Networks', 'Concepts', 'Tech', 'Ventures', 'Cloud', 'Media', 'Logix']
}

const jobTitles = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Product Manager', 'Data Scientist',
  'DevOps Engineer', 'QA Engineer', 'UI/UX Designer', 'Mobile Developer', 'Technical Lead',
  'Site Reliability Engineer', 'Security Engineer', 'Business Analyst', 'Support Engineer', 'Marketing Manager'
]

const locations = ['San Francisco, CA','New York, NY','Austin, TX','Remote','Chicago, IL','Seattle, WA','Denver, CO','Boston, MA','London, UK','Bengaluru, India']
const jobTypes = ['Full-time','Part-time','Contract','Internship','Remote']
const requirementsPool = [
  'Strong communication skills', '3+ years experience', 'Proficiency in JavaScript', 'Familiarity with React',
  'Experience with Node.js', 'Knowledge of REST APIs', 'Experience with databases (MongoDB, PostgreSQL)',
  'Unit testing experience', 'Familiarity with cloud providers (AWS/GCP/Azure)', 'Experience with CI/CD'
]

const makeCompanyName = (i) => `${rand(companyNameParts.adjectives)} ${rand(companyNameParts.nouns)} ${i}`

const makeDescription = (name) => `${name} is a fast-growing company building modern solutions to help businesses deliver value. We focus on engineering excellence and a collaborative culture.`

const makeWebsite = (name) => `https://www.${name.replace(/[^a-zA-Z]/g,'').toLowerCase()}.com`

const makeLogoUrl = (i) => `https://picsum.photos/seed/company${i}/120/120`

const makeJobDescription = (title, companyName) => `${companyName} is hiring a ${title} to join our growing team. You'll work closely with cross-functional teams to build and deliver high-quality products.`

async function seed() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Create a small set of recruiters and students for ownership
    const recruiters = []
    const students = []

    // create 5 recruiters
    for (let i = 1; i <= 5; i++) {
      const email = `recruiter${i}@seed.local`;
      const existing = await User.findOne({ email });
      if (existing) {
        recruiters.push(existing);
        continue;
      }
      const passwordHash = await bcrypt.hash('Password123!', 10);
      const user = await User.create({
        fullname: `Recruiter ${i}`,
        email,
        phoneNumber: 9000000000 + i,
        password: passwordHash,
        role: 'recruiter',
        profile: { bio: `I am recruiter ${i}`, skills: [], profilePhoto: '' }
      })
      recruiters.push(user);
    }

    // create 5 students
    for (let i = 1; i <= 5; i++) {
      const email = `student${i}@seed.local`;
      const existing = await User.findOne({ email });
      if (existing) {
        students.push(existing);
        continue;
      }
      const passwordHash = await bcrypt.hash('Password123!', 10);
      const user = await User.create({
        fullname: `Student ${i}`,
        email,
        phoneNumber: 8000000000 + i,
        password: passwordHash,
        role: 'student',
        profile: { bio: `I am student ${i}`, skills: ['HTML','CSS'], profilePhoto: '' }
      })
      students.push(user);
    }

    // Create 25 companies
    const companies = []
    for (let i = 1; i <= 25; i++) {
      const name = makeCompanyName(i)
      const website = makeWebsite(name)
      const location = rand(locations)
      const logo = makeLogoUrl(i)
      const description = makeDescription(name)
      const owner = rand(recruiters)

      const company = await Company.create({
        name,
        description,
        website,
        location,
        logo,
        userId: owner._id
      })
      companies.push(company)
    }

    // Create 25 jobs - distributed across companies
    const jobs = []
    for (let i = 1; i <= 25; i++) {
      const company = companies[(i - 1) % companies.length]
      const title = `${rand(jobTitles)} ${i}`
      const description = makeJobDescription(title, company.name)
      const requirements = []
      const reqCount = randomInt(2, 5)
      for (let r = 0; r < reqCount; r++) requirements.push(rand(requirementsPool))
      const salary = randomInt(40000, 180000)
      const experienceLevel = randomInt(0, 10)
      const location = rand(locations)
      const jobType = rand(jobTypes)
      const position = randomInt(1, 10)
      const created_by = company.userId || rand(recruiters)._id

      const job = await Job.create({
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
      })
      jobs.push(job)
    }

    console.log(`Seed complete: ${recruiters.length} recruiters, ${students.length} students, ${companies.length} companies, ${jobs.length} jobs created.`)
    process.exit(0)
  } catch (error) {
    console.error('Seeding error', error)
    process.exit(1)
  }
}

seed()
