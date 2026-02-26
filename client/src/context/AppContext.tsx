import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DocumentHistory {
    id: string;
    name: string;
    date: string;
    type: string;
    summary: string;
}

interface AppContextType {
    history: DocumentHistory[];
    addHistory: (doc: DocumentHistory) => void;
    currentDocument: DocumentHistory | null;
    setCurrentDocument: (doc: DocumentHistory | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistory] = useState<DocumentHistory[]>([
        {
            id: '1',
            name: 'Rental Agreement.pdf',
            date: '2024-05-10',
            type: 'Lease',
            summary: 'Standard residential lease agreement for 11 months.'
        }
    ]);
    const [currentDocument, setCurrentDocument] = useState<DocumentHistory | null>(null);

    const addHistory = (doc: DocumentHistory) => {
        setHistory(prev => [doc, ...prev]);
    };

    return (
        <AppContext.Provider value={{ history, addHistory, currentDocument, setCurrentDocument }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
