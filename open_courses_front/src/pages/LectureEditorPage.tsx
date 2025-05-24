import MarkdownEditor from "@/components/Editor/MarkdownEditor";
import Header from "@/components/Header";

const LectureEditorPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex flex-col items-center">
                <MarkdownEditor />
            </main>
        </div >
    );
};

export default LectureEditorPage;