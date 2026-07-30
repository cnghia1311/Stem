import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import api from "@/apis/authApi";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

type Step = 'email' | 'otp' | 'details';

type RegisterProps = {
  onSuccess?: () => void;
};

export const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/send-otp', { email });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gửi mã xác thực thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/verify-otp', { email, otp });
      setVerifyToken(res.data.verifyToken);
      setStep('details');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã xác thực không đúng!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/register', {
        displayName: name,
        email,
        password,
        verifyToken,
      });

      // Đăng ký xong -> lưu token luôn, không bắt đăng nhập lại
      localStorage.setItem('token', res.data.accessToken);
      onSuccess?.();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
            <Hexagon size={28} fill="currentColor" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1E1E2F] tracking-wide">LEARNIFY</h1>
          <p className="text-[#666666] text-sm">Create your new account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center mb-5">{error}</div>}

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-[#1E1E2F] text-sm font-medium mb-2">Email</label>
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button variant="default" className="w-full !mt-8" type="submit" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-sm text-[#666666]">Mã xác thực đã được gửi tới <b>{email}</b>. Vui lòng kiểm tra hộp thư (kể cả mục spam).</p>
            <div>
              <label className="block text-[#1E1E2F] text-sm font-medium mb-2">Mã OTP</label>
              <Input type="text" placeholder="Nhập mã 6 số" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            </div>
            <Button variant="default" className="w-full !mt-8" type="submit" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
            <button type="button" className="text-sm text-[#8B5CF6] hover:underline w-full text-center" onClick={handleSendOtp}>
              Gửi lại mã
            </button>
          </form>
        )}

        {step === 'details' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[#1E1E2F] text-sm font-medium mb-2">Name</label>
              <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[#1E1E2F] text-sm font-medium mb-2">Password</label>
              <Input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button variant="default" className="w-full !mt-8" type="submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Register'}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-[#666666] mt-6">
          Already have an account? <Link to="/login" className="text-[#8B5CF6] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};