'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const handleClick = () => {
        router.push('/replai');
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-[390px] h-auto bg-white flex-col justify-start items-start inline-flex">
                <div className="w-full bg-white shadow flex justify-between items-center px-4 py-2 sm:px-6 sm:py-4">
                    <a
                        href="https://cat-form-2c7.notion.site/a480ee4fb4364e2ba377cb282b1a5732"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                    >
                        <div className="text-black text-lg sm:text-2xl font-bold font-['Inter']">repr</div>
                        <div className="text-orange-500 text-lg sm:text-2xl font-bold font-['Inter']">AI</div>
                    </a>
                    <div className="w-auto p-2 sm:p-4 flex justify-center items-center gap-2.5 mr-2 sm:mr-4">
                        <button
                            className="text-zinc-600 text-xs sm:text-sm font-bold font-['Inter'] bg-white hover:bg-gray-300 px-4 py-2 rounded"
                            onClick={handleClick}
                        >
                            執筆する
                        </button>
                    </div>
                </div>
                <div className="w-full h-[auto] relative">
                    <div className="w-full h-full absolute top-0 left-0 bg-black opacity-50" />
                    <img className="w-full h-full object-cover" src="glenn-carstens-peters-npxXWgQ33ZQ-unsplash 1.png" alt="背景画像" />
                    <div className="absolute left-4 sm:left-8 top-[20%] sm:top-[30%]">
                        <span className="text-white text-lg sm:text-[32px] font-bold font-['Inter']">誰にでも、</span>
                        <span className="text-white text-lg sm:text-[32px] font-bold font-['Inter'] underline">簡単に</span>
                        <span className="text-white text-lg sm:text-[32px] font-bold font-['Inter']">伝わるメールを</span>
                    </div>
                </div>
                <div className="w-full h-16 relative bg-red-700 flex items-center justify-start px-4 sm:px-8">
                    <div className="text-white text-lg sm:text-2xl font-bold font-['Inter']">サービスの特徴</div>
                </div>
                <div className="w-full px-4 sm:px-8 py-6 flex-col justify-start items-center gap-4 flex">
                    <div className="text-black text-xl sm:text-2xl font-bold font-['Inter']">文章の特徴が点数で分かる。</div>
                    <div className="text-black text-xs sm:text-sm font-normal font-['Inter']">reprAIなら、文章の曖昧さやフォーマルさが5段階評価でわかります。</div>
                    <img className="w-full h-auto max-h-60 object-cover" src="1404 1.png" alt="特徴1" />
                    <div className="text-black text-xl sm:text-2xl font-bold font-['Inter']">伝わりにくいを防止。</div>
                    <div className="text-black text-xs sm:text-sm font-normal font-['Inter']">具体的にどこが悪いのか、一人で書いていたら気付けない伝わりにくさを、AIが意味を理解して提案します。</div>
                    <img className="w-full h-auto max-h-60 object-cover" src="1368 1.png" alt="特徴2" />
                    <div className="text-black text-xl sm:text-2xl font-bold font-['Inter']">ワンクリックですぐ修正。</div>
                    <div className="text-black text-xs sm:text-sm font-normal font-['Inter']">ついつい時間が過ぎてしまいがちなメール執筆ですが、reprAIならすぐに改善できます。</div>
                    <img className="w-full h-auto max-h-60 object-cover" src="1394 1.png" alt="特徴3" />
                    <div className="px-4 sm:px-8 py-2 sm:py-3 bg-red-700 rounded-full flex justify-center items-center">
                        <div className="text-white text-lg sm:text-2xl font-bold font-['Inter']">
                            <button onClick={handleClick}>さっそく使ってみる</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
