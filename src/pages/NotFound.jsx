import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.message}>Page not found</p>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className={styles.actions}>
            <button 
              className={styles.primaryBtn}
              onClick={() => navigate('/')}
            >
              <Home size={18} />
              <span>Go Home</span>
            </button>
            <button 
              className={styles.secondaryBtn}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
