"use client";

import React, { useEffect, useState } from "react";

type Func = {
    id: string;
    name: string;
    arg: string;
};

export default function Home() {
    const [funcList, setFuncList] = useState<string[]>([]);
    const [init, setInit] = useState("");
    const [inputFuncList, setInputFuncList] = useState<Func[]>([]);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModules = async () => {
            const module = await import("@/pkg/project");
            const nextFuncList = [];

            for (const [key, value] of Object.entries(module)) {
                if (typeof value === "function" && key.substring(0, 2) !== "__") {
                    nextFuncList.push(key);
                }
            }

            setFuncList(nextFuncList);
        };

        loadModules();
        handleClickAdd();
    }, []);

    const handleClickAdd = () => {
        setInputFuncList((prev) => [...prev, { id: String(performance.now()), name: "", arg: "" }]);
    };

    const handleClickRemove = (id: string) => {
        setInputFuncList((prev) => prev.filter((func) => func.id !== id));
    };

    const handleClickCalc = async () => {
        setResult(null);
        setError(null);

        if (!init) {
            setError("初期値を入力してください");
            return;
        }

        const module = await import("@/pkg/project");
        let nextResult = Number(init);

        for (let i = 0; i < inputFuncList.length; i++) {
            try {
                const func = inputFuncList[i];
                nextResult = module[func.name](nextResult, Number(func.arg));
            } catch (error) {
                setError(`func ${i + 1}: ${error}`);
                return;
            }
        }

        setResult(nextResult);
    };

    const handleChangeName = (id: string, name: string) => {
        setInputFuncList((prev) => prev.map((func) => func.id === id ? { ...func, name } : func));
    };

    const handleChangeArg = (id: string, arg: string) => {
        setInputFuncList((prev) => prev.map((func) => func.id === id ? { ...func, arg } : func));
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <label htmlFor="init" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">初期値</label>
                <input
                    type="number"
                    id="init"
                    className="
                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                    "
                    placeholder="init"
                    required
                    value={init}
                    onChange={(e) => setInit(e.target.value)}
                />
            </div>
            <div className="flex items-center">
                <button
                    type="button"
                    className="
                        text-white bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                        dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                    "
                    onClick={handleClickAdd}
                >
                    追加
                </button>
                <button
                    type="button"
                    className="
                        text-white bg-green-700 hover:bg-green-800
                        focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                        dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800
                    "
                    onClick={handleClickCalc}
                >
                    計算
                </button>
                {result !== null && (
                    <div>
                        計算結果: {result}
                    </div>
                )}
                {error && (
                    <div className="text-red-600">
                        {error}
                    </div>
                )}
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                処理順
                            </th>
                            <th scope="col" className="px-6 py-3">
                                関数名
                            </th>
                            <th scope="col" className="px-6 py-3">
                                引数
                            </th>
                            <th scope="col" className="px-6 py-3">
                                削除
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {inputFuncList.map((func, index) => (
                            <tr key={func.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {index + 1}
                                </th>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        list={func.id}
                                        className="
                                            bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        "
                                        placeholder="function name"
                                        spellCheck={false}
                                        required
                                        onChange={(e) => handleChangeName(func.id, e.target.value)}
                                    />
                                    <datalist id={func.id}>
                                        {funcList.map((name) => (
                                            <React.Fragment key={name}>
                                                <option value={name}>{name}</option>
                                            </React.Fragment>
                                        ))}
                                    </datalist>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        className="
                                            bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        "
                                        placeholder="value"
                                        required
                                        onChange={(e) => handleChangeArg(func.id, e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="
                                            text-white bg-red-700 hover:bg-red-800
                                            focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                                            dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800
                                        "
                                        onClick={() => handleClickRemove(func.id)}
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
