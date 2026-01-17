import { motion } from 'framer-motion'
import './AnimatedGirl.css'

const AnimatedGirl = () => {
  return (
    <div className="animated-girl-container">
      <motion.div
        className="animated-girl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Head */}
        <motion.div
          className="girl-head"
          animate={{
            y: [0, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="girl-face">
            <div className="girl-eye left-eye">
              <div className="eye-pupil"></div>
            </div>
            <div className="girl-eye right-eye">
              <div className="eye-pupil"></div>
            </div>
            <div className="girl-smile"></div>
          </div>
          <div className="girl-hair"></div>
        </motion.div>

        {/* Body */}
        <div className="girl-body">
          <div className="girl-dress"></div>
        </div>

        {/* Left Arm - Holding Phone/Device */}
        <motion.div
          className="girl-arm left-arm phone-arm"
          animate={{
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="arm-hand">
            <motion.div
              className="phone-device"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="phone-screen">
                <div className="phone-content">📄</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Arm - Waving Hello */}
        <motion.div
          className="girl-arm right-arm"
          animate={{
            rotate: [0, 30, -10, 30, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="arm-hand wave-hand"
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Speech Bubble - Saying Hello */}
        <motion.div
          className="speech-bubble"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            y: [0, -10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <span>Hello! 👋</span>
        </motion.div>

        {/* Legs */}
        <div className="girl-legs">
          <div className="girl-leg left-leg"></div>
          <div className="girl-leg right-leg"></div>
        </div>

        {/* Shadow */}
        <motion.div
          className="girl-shadow"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}

export default AnimatedGirl
