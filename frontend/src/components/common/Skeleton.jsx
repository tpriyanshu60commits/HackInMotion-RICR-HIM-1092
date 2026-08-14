import { motion } from 'framer-motion';


const Skeleton = ({ className, width, height, borderRadius = '0.5rem' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1,
      }}
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
