"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import Meets from './components/Meets/Meets';
import CreateMeetPortal from './components/CreateMeetPortal/CreateMeetPortal';
import MyApplications from './components/MyApplications/MyApplications';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

enum MeetsPageType {
    meets = "meets",
    myApplications = "myApplications"
}

export default function AccountMeets() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('AccountMeets');
    const [currentTab, setCurrentTab] = useState<MeetsPageType>(MeetsPageType.meets);

    useEffect(() => {
        if (searchParams.get('tab')) {
            if(searchParams.get('tab') === 'meets') {
                setCurrentTab(MeetsPageType.myApplications);
            } else if(searchParams.get('tab') === 'search') {
                setCurrentTab(MeetsPageType.meets);
            }
        }
    }, [searchParams]);

    let content;
    switch (currentTab) {
        case MeetsPageType.meets:
            content = <Meets />
            break;
        case MeetsPageType.myApplications:
            content = <MyApplications />
            break;
        default:
            break;
    }

    const handleSetTab = (tab: MeetsPageType) => {
        setCurrentTab(tab);
        if(tab === MeetsPageType.meets) {
            router.replace(`/account/meets?tab=search`);
        } else if(tab === MeetsPageType.myApplications) {
            router.replace(`/account/meets?tab=meets`);
        }
    }

    return (
        <main className={styles.container}>
            <h1>{t(`tabs.${currentTab}`)}</h1>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.meets ? styles.tabButtonActive : ''}`}
                    onClick={() => handleSetTab(MeetsPageType.meets)}
                >
                    {t('tabs.meets')}
                </button>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.myApplications ? styles.tabButtonActive : ''}`}
                    onClick={() => handleSetTab(MeetsPageType.myApplications)}
                >
                    {t('tabs.myApplications')}
                </button>

                <CreateMeetPortal />
            </div>

            <div className={styles.content}>
                {content}
            </div>
        </main>
    );
}