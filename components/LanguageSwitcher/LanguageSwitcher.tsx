'use client';

import { useLocale } from 'next-intl';
import { setLocale } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/Dropdown/Dropdown';
import styles from './LanguageSwitcher.module.css';

const languages = [
  { key: 'ru', label: 'Русский' },
  { key: 'en', label: 'English' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    await setLocale(newLocale);
    router.refresh();
  };

  return (
    <div className={styles.switcher}>
      <div className={styles.dropdownWrapper}>
        <Dropdown
          source={languages}
          current={locale}
          onChange={handleLocaleChange}
        />
      </div>
    </div>
  );
}

