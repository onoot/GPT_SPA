import {IconFileImport, IconUser} from '@tabler/icons-react';
import { FC, useState } from 'react';

import { useTranslation } from 'next-i18next';

import {importData, SupportedExportFormats} from '@/types/export';

import { SidebarButton } from '../Sidebar/SidebarButton';
import PaymentForm from "@/components/PayButton/PaymentForm";

interface Props {
    onImport: (data: SupportedExportFormats) => void;
}

export const Import: FC<Props> = ({ onImport }) => {
    const { t } = useTranslation('sidebar');
    const [showPaymentForm, setShowPaymentForm] = useState(false);


    return (
        <>
            <input
                id="import-file"
                className="sr-only"
                tabIndex={-1}
                type="file"
                accept=".json"
                onChange={(e) => {
                    if (!e.target.files?.length) return;

                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const json = JSON.parse(e.target?.result as string);
                        onImport(json);
                    };
                    reader.readAsText(file);
                }}
            />


            <SidebarButton
                text={t('Update Plus')}
                icon={<IconUser size={18} />}
                onClick={() => setShowPaymentForm(true)}
            />

            {showPaymentForm && <PaymentForm  setShow={(show) => setShowPaymentForm(show)} show/>}

            <SidebarButton
                text={t('Import data')}
                icon={<IconFileImport size={18} />}
                onClick={() => {
                    const importFile = document.querySelector(
                        '#import-file',
                    ) as HTMLInputElement;
                    if (importFile) {
                        importFile.click();
                    }
                }}
            />
        </>
    );
};
