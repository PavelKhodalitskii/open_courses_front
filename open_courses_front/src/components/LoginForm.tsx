import {useForm} from 'react-hook-form'

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

import apiClient from '@/api/client';

type FormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const {
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.post("/auths/session_based_auths/login/", JSON.stringify(data), 
      {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Ответ сервера:", response);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className='p-10 rounded-md border  border-gray-400 h-90 flex flex-col justify-center gap-5'>
      <h1 >Войти в Ипсилон</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-5 w-70">
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor="email">Почта</Label>
          <Input 
            type='email'  
            id='email'
            placeholder='Почта'
            {...register("email", {required: "Поле почты обязательно"})}
            className='w-full bg-gray-100'
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor="password">Пароль</Label>
          <Input
            type="password"
            id="password"
            placeholder="••••••••"
            className='w-full bg-gray-100'
            {...register("password", { required: "Пароль обязателен" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full bg-green-300" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Отправка...
            </>
          ) : (
            <>
              Войти
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm