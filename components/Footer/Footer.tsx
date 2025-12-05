import Link from 'next/link';
import styles from './Footer.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');
    
    return (
        <footer className={styles.footer} id="footer">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.column}>
                        <h3 className={styles.logo}>Friends4Evening</h3>
                        <p className={styles.description}>
                            {t('description')}
                        </p>
                        <LanguageSwitcher />
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('columns.navigation')}</h4>
                        <ul className={styles.links}>
                            <li><Link href="/#hero">{t('links.home')}</Link></li>
                            <li><Link href="/#how-it-works">{t('links.howItWorks')}</Link></li>
                            <li><Link href="/apps">{t('links.apps')}</Link></li>
                            <li><Link href="/contacts">{t('links.contacts')}</Link></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('columns.information')}</h4>
                        <ul className={styles.links}>
                            <li><Link href="/#security">{t('links.security')}</Link></li>
                            <li><Link href="/#testimonials">{t('links.testimonials')}</Link></li>
                            <li><Link href="/account">{t('links.account')}</Link></li>
                            <li><Link href="/login">{t('links.login')}</Link></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('columns.contacts')}</h4>
                        <ul className={styles.links}>
                            <li><Link href="mailto:Friends4Evening@lovigin.com">{t('links.support')}</Link></li>
                            <li><Link href="/agreement">{t('links.agreement')}</Link></li>
                            <li><Link href="/privacy">{t('links.privacy')}</Link></li>
                            <li><Link href="/rules">{t('links.rules')}</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Friends4Evening. <span className={styles.age}>18+.</span> {t('copyright')}.
                    </p>
                </div>
            </div>
        </footer>
    );
}
