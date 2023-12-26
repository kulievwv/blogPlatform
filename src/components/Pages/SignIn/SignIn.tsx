import React, { useEffect } from "react";
import classes from './signIn.module.scss';
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { ILoginField } from "../../../Interfaces/interfaces";
import { useLogInMutation } from "../../../API/api";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from "../../../Redux/Slices";
import { RootState } from "../../../Redux/store";

export const SigIn: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/blogPlatform/articles', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm<ILoginField>();
    const [signUp, { error }] = useLogInMutation();

    const typedError = error as { status: number; data: { errors: Record<string, string> } };
    const getError = (fieldName: string) => {
        if (typedError && typedError.data && typedError.data.errors) {
            return typedError.data.errors[fieldName];
        }
        return null;
    };

    const onSubmit: SubmitHandler<ILoginField> = (user) => {
        signUp({ 'user': { 'email': user.email, 'password': user.password } })
            .unwrap()
            .then((payload) => {
                Cookies.set('token', payload.user.token, { expires: 7, path: '/' });
                dispatch(setLoggedIn(true));
                navigate('/blogPlatform/articles', { replace: true });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.title}>Sign in</div>
            <div className={classes.inputs}>
                <div className={classes.email}>
                    Email address
                    <input 
                        placeholder="Email"
                        autoComplete="email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required field',
                            pattern: {
                                value: /^[a-z][^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors?.email && <div className={classes.error}>{errors.email.message}</div>}
                    {getError('email or password') && <div className={classes.error}>Email or password {getError('email or password')}</div>}
                </div>
                <div className={classes.password}>
                    Password
                    <input 
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'Password is required field',
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            },
                            maxLength: {
                                value: 40,
                                message: "Password must not exceed 40 characters"
                            }
                        })}
                    />
                    {errors?.password && <div className={classes.error}>{errors.password.message}</div>}
                </div>
                <input type='submit' value="Login" className={classes.login}></input>
            </div>
            <div className={classes.haveAccount}>Don't have an account? <Link to='/blogPlatform/registration'>Sign Up.</Link></div>
        </form>
    );
}
