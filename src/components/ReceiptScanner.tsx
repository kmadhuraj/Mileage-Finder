import React, { useState } from 'react';
import { Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';

interface Props {
    onScan: (data: { fuel?: number; price?: number; total?: number }) => void;
}

export const ReceiptScanner: React.FC<Props> = ({ onScan }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setStatus('Processing receipt...');

        try {
            const result = await Tesseract.recognize(file, 'eng');
            const text = result.data.text;

            // Simple regex to extract common receipt patterns
            // These are naive and would need refinement for production
            const fuelMatch = text.match(/(\d+\.?\d*)\s*(L|Litres|Gallons)/i);
            const priceMatch = text.match(/Price\s*:?\s*(\d+\.?\d*)/i);
            const totalMatch = text.match(/Total\s*:?\s*(\d+\.?\d*)/i);

            onScan({
                fuel: fuelMatch ? parseFloat(fuelMatch[1]) : undefined,
                price: priceMatch ? parseFloat(priceMatch[1]) : undefined,
                total: totalMatch ? parseFloat(totalMatch[1]) : undefined,
            });

            setStatus('Scan successful!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('Scan failed. Try again.');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Receipt Auto-Fill</h4>
                        <p className="text-xs opacity-60">Scan receipt to fill details</p>
                    </div>
                </div>

                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isScanning}
                    />
                    <div className="btn-secondary !px-4 !py-2 text-xs flex items-center gap-2">
                        {isScanning ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : status === 'Scan successful!' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : status.includes('failed') ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                            'Upload Image'
                        )}
                    </div>
                </label>
            </div>

            {status && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[10px] mt-2 text-blue-500 font-medium"
                >
                    {status}
                </motion.p>
            )}
        </div>
    );
};
