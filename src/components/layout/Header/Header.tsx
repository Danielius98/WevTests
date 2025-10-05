import Menu from '../Menu/Menu';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';

import styles from './Header.module.scss';

const Header = (): React.ReactElement => (
  <header className={styles.Header}>
    <div className={styles.title}>Вэб разработка</div>
    <div className={styles.rightSection}>
      <Menu />
      <ThemeToggle />
    </div>
  </header>
);

export default Header;
