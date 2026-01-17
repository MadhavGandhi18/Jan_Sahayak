import { motion } from 'framer-motion'
import './AboutUs.css'

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Madhav Gandhi',
      email: 'member1@jansahayak.com',
      contact: '+91 98765 43210',
      role: 'Team Leader',
      teamName: 'Jan Sahayak Team'
    },
    {
      name: 'Divya Chaudhary',
      email: 'member2@jansahayak.com',
      contact: '+91 7678168487',
      role: 'AI Specialist',
      teamName: 'Jan Sahayak Team'
    },
    {
      name: 'Advitiya Sharma',
      email: 'member3@jansahayak.com',
      contact: '+91 98765 43212',
      role: 'UI/UX Designer',
      teamName: 'Jan Sahayak Team'
    },
    {
      name: 'Manya',
      email: 'member4@jansahayak.com',
      contact: '+91 98765 43213',
      role: 'Backend Developer',
      teamName: 'Jan Sahayak Team'
    }
  ]

  return (
    <div className="about-us-page">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Meet the team behind Jan Sahayak
        </motion.p>
      </div>

      <div className="about-content">
        <motion.div
          className="about-intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Our Mission</h2>
          <p>
            Jan Sahayak is dedicated to simplifying document generation and form filling
            processes through the power of artificial intelligence. We aim to make
            bureaucratic procedures more accessible and efficient for everyone.
          </p>
        </motion.div>

        <div className="team-section">
          <h2 className="team-title">Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="team-avatar">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <div className="team-info">
                  <p className="team-name-label">{member.teamName}</p>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <div className="team-contact">
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Contact:</strong> {member.contact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
