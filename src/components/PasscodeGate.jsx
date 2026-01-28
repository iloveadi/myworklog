import React, { useState } from 'react';

export default function PasscodeGate({ onAuthenticated }) {
    const [passcode, setPasscode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passcode === '1212') {
            onAuthenticated();
        } else {
            setErrorMsg('비밀번호가 올바르지 않습니다.');
            setPasscode('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-transparent">
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                <h1 className="mb-2 text-2xl font-bold text-center text-slate-900">비밀번호 확인</h1>
                <p className="mb-6 text-sm text-center text-slate-600">
                    접속하려면 비밀번호를 입력하세요.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            className="w-full px-4 py-3 text-center tracking-widest text-lg border rounded-lg bg-slate-50 border-slate-300 focus:ring-2 focus:ring-slate-500 focus:outline-none transition-all"
                            type="password"
                            placeholder="CODE"
                            value={passcode}
                            maxLength={4}
                            autoFocus
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                    </div>
                    {errorMsg && (
                        <div className="text-red-500 text-sm text-center font-medium">
                            {errorMsg}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 font-bold text-white transition-colors bg-slate-900 rounded-lg hover:bg-slate-800"
                        >
                            입장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
