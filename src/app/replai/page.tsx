'use client';

import * as React from "react";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookCopy, SendHorizontal, FileCheck, Frown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface BackendData {
    fixed: string;
    fixes: {
        title: string;
        fixed: string;
    }[];
    score: {
        politeness: number;
        readability: number;
    };
}

const LoadingSpinner = () => <div className="loader">修正中...</div>;


export default function Home() {
    const [backendData, setBackendData] = useState<BackendData | null>(null);
    const [text, setText] = useState<string>(""); // 初期値を空文字列に設定
    const [outputText, setOutputText] = useState<string>("修正例はここ");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleClick = () => {
        router.push('/');
    }

    const getData = useCallback(async () => {
        const requestStartTime = Date.now(); // リクエスト開始時間を記録
        if (text.trim() === "" && (backendData?.fixed || "").trim() === "") {
            toast.warning("入力欄にテキストを入力してください");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(
                `https://reprai-o3mmnjeefa-an.a.run.app/?text=${JSON.stringify(text)}`
            );
            const responseTime = Date.now() - requestStartTime; // レスポンスタイムを計算
            console.log(`Total response time: ${responseTime} ms`);

            // レスポンスデータをセット
            setBackendData(response.data);
            if (response.data) {
                let filteredFixed = response.data.fixed.replace(/["“”「」]/g, "");
                const bodyIndex = filteredFixed.indexOf("本文：");
                const subjectIndex = filteredFixed.indexOf("件名：");

                if (bodyIndex !== -1 && subjectIndex !== -1) {
                    filteredFixed = filteredFixed.slice(bodyIndex + 4);
                }

                if (filteredFixed === text) {
                    toast.info("入力された値と修正値が一致しました。修正の必要はありません。", {
                        autoClose: 5000,
                        closeButton: false,
                    });
                } else {
                    setOutputText(filteredFixed || "修正例はここ");
                }
            } else {
                setOutputText("修正例はここ");
            }
            console.log(response.data);
        } catch (error) {
            console.error(error);
            toast.error(
                <div>
                    リクエストが失敗しました
                    <Button onClick={getData} className="ml-2">
                        再試行
                    </Button>
                </div>,
                {
                    autoClose: 5000,
                    closeButton: true,
                }
            );
        } finally {
            setLoading(false);
        }
    }, [text, backendData?.fixed]); // backendData?.fixed を依存関係に含める


    const copyFixedData = () => {
        if (text.trim() === "" && (backendData?.fixed || "").trim() === "") {
            toast.warning("入力欄にテキストを入力してください");
            return;
        } else if (text.trim() !== "" && (backendData?.fixed || "").trim() === "") {
            toast.warning("修正ボタンを押してください");
            return;
        }

        if (backendData) {
            let filteredFixed = backendData.fixed.replace(/["“”「」]/g, ''); // ダブルクォーテーションや角括弧を除外する正規表現

            // 修正結果に「件名；」と「本文；」が含まれているかチェック
            const subjectIndex = filteredFixed.indexOf("件名：");
            const bodyIndex = filteredFixed.indexOf("本文:");

            if (subjectIndex !== -1 && bodyIndex !== -1) {
                // 「本文；」の後の値を取得してクリップボードにコピー
                filteredFixed = filteredFixed.slice(bodyIndex + 4);
            }

            navigator.clipboard.writeText(filteredFixed);
            toast.success("コピーが成功しました！");
        }
    };

    useEffect(() => {
        if (backendData) {
            let filteredFixed = backendData.fixed.replace(/["“”「」]/g, ''); // ダブルクォーテーションや角括弧を除外する正規表現

            // 修正結果に「件名；」と「本文；」が含まれているかチェック
            const subjectIndex = filteredFixed.indexOf("件名:");
            const bodyIndex = filteredFixed.indexOf("本文:");

            if (subjectIndex !== -1 || bodyIndex !== -1) {
                // 「本文；」の後の値を取得してセット
                filteredFixed = filteredFixed.slice(bodyIndex + 4);
            }

            setOutputText(filteredFixed || "修正例はここ");
        } else {
            setOutputText("修正例はここ");
        }
    }, [backendData]);

    return (
        <>
            <TooltipProvider   >
                <ToastContainer />
                <div className={`flex items-center justify-between w-full mb-4 px-4 py-2 border-b `}>
                    <Button
                        onClick={handleClick}
                        className="text-lg font-bold text-black"
                        variant="link"
                    >
                        repr<span className="text-orange-500">AI</span>
                    </Button>

                    <p className="text-lg font-bold text-right">執筆する</p>
                </div>
                <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
                    <div className="flex flex-col items-center justify-center w-full">
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="ここにテキストを入力"
                            className="w-full h-48 border-white outline:none"
                            style={{ borderColor: 'white' }}
                        />
                        <div className={`w-full bg-gray-50 p-4 rounded-md whitespace-pre-wrap`}>
                            {outputText}
                        </div>
                        <div
                            className={`flex flex-col sm:flex-row items-center justify-between w-full bg-gray-100 rounded-md p-4 mb-4 text-sm text-gray-500 `}
                        >
                            <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                                文字数: {text ? text.replace(/\n/g, "").length : 0}
                            </p>
                            <div className="flex items-center mb-2 sm:mb-0">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span style={{ color: "black", marginRight: "3rem", display: "flex", alignItems: "center" }}>
                                            <Frown />
                                            : {backendData ? backendData.score.politeness : "-"}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>分かりやすさ</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span style={{ color: "black", marginLeft: "3rem", display: "flex", alignItems: "center" }}>
                                            <FileCheck />
                                            : {backendData ? backendData.score.readability : "-"}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>読みやすさ</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center">
                                <Button onClick={copyFixedData} className="mr-2">
                                    <BookCopy />
                                </Button>
                                <Button className="bg-green-500 hover:bg-green-600" onClick={() => getData()} disabled={loading}>
                                    {loading ? <LoadingSpinner /> : <SendHorizontal />}
                                </Button>
                            </div>
                        </div>
                        <div className="w-full h-4"></div> {/* 空白の追加 */}
                        <div className="w-full bg-gray-50 p-4 rounded-md shadow-inner">
                            {/* レスポンスが返ってきたら修正結果を表示 */}
                            {backendData && (
                                <>
                                    {backendData.fixes.map((fix, index) => (
                                        <div key={index}>
                                            <p className="font-bold">{fix.title}</p>
                                            <p>{fix.fixed}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                            {!backendData && (
                                <div className="w-full">
                                    <p className="w-full">サジェスト:</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main >
            </TooltipProvider>
        </>
    );
}
