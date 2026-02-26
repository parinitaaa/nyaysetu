import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Upload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();
    const { addHistory, setCurrentDocument } = useAppContext();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = () => {
        if (!file) return;

        setIsAnalyzing(true);

        // Simulate AI Analysis Delay
        setTimeout(() => {
            const newDoc = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                date: new Date().toISOString().split('T')[0],
                type: 'Legal Document',
                summary: 'Automatically generated summary of ' + file.name
            };

            addHistory(newDoc);
            setCurrentDocument(newDoc);
            setIsAnalyzing(false);
            navigate('/summary');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Document Analysis</h1>
                <p className="text-slate-600">Upload your legal documents for instant simplification and risk analysis.</p>
            </div>

            <div className="glass-card rounded-3xl p-12 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all text-center group">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <UploadIcon className="w-10 h-10 text-blue-600" />
                    </div>
                    {file ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle2 size={20} />
                                <span>{file.name}</span>
                            </div>
                            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-slate-900">Drag & drop or <span className="text-blue-600">browse</span></p>
                            <p className="text-slate-500">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
                        </div>
                    )}
                </label>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span>Analyzing Document...</span>
                        </>
                    ) : (
                        <>
                            <FileText size={22} />
                            <span>Analyze Now</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <AlertCircle className="text-blue-600 mt-1 shrink-0" size={20} />
                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                    Your documents are processed locally using privacy-preserving AI. We do not store your private data on our servers.
                </p>
            </div>
        </div>
    );
};
