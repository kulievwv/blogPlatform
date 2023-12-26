import React, {useEffect} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterField } from "../../../Interfaces/interfaces";
import classes from './signUp.module.scss'
import { Link } from "react-router-dom";
import { useSignUpMutation } from "../../../API/api";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from "../../../Redux/Slices";
import { useSelector } from 'react-redux';
import { RootState } from "../../../Redux/store";


export const SignUp: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/articles', { replace: true });
        }
    }, [isLoggedIn, navigate]);
    const {
        register, 
        handleSubmit, 
        formState: {errors},
        watch
    } = useForm<IRegisterField>({
        mode: 'onChange'
    });
    const [signUp,  { data, error, isLoading, isSuccess, isError }] =useSignUpMutation()

    const typedError = error as { status: number; data: { errors: Record<string, string> } };

    // Функция для получения сообщения об ошибке по имени поля
    const getError = (fieldName: string) => {
        if (typedError && typedError.data && typedError.data.errors) {
            return typedError.data.errors[fieldName];
        }
        return null;
    };

    const onSubmit:SubmitHandler<IRegisterField> = (user) => {
        signUp({ 'user':{
                    'username': user.username,
                    'email': user.email,
                    'password': user.password
                }}).unwrap()
                .then((payload) => {
                    Cookies.set('token', payload.user.token, { expires: 7, path: '/' });
                    dispatch(setLoggedIn(true))
                    navigate('/articles', { replace: true })
                })
                .catch((error) => {
                    
                });
  
    }
    return(
        <>
            <form className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.title}>Create new account</div>
                <div className={classes.inputs}>
                    <div className={classes.username}>Username
                        <input 
                        placeholder="Username"
 
                        { ...register('username', {
                            required: 'Name is require field',
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                              },
                              maxLength: {
                                value: 20,
                                message: "Username must not exceed 20 characters"
                              }
                        })} 
                        />
                        {errors?.username && <div className={classes.error}> {errors.username.message}</div> 
                        || getError('username') && <div className={classes.error}> {`Username ${getError('username')}`}</div>}
                        
                        
                    </div>
                    <div className={classes.email}>Email address
                        <input 
                         placeholder="Email"
                         type="email"
                        { ...register('email', {
                            required: 'Email is require field',
                            pattern: {
                                value: /^[a-z][^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                              }
                        })} 
                        />
                        {errors?.email && <div className={classes.error}> {errors.email.message}</div>
                        || getError('email') && <div className={classes.error}> {`Email ${getError('email')}`}</div>}
                    
                    </div>
                    <div className={classes.password}>Password
                        <input 
                         placeholder="Password"
                         type="password"
                        { ...register('password', {
                            required: 'Password is require field',
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
                        {errors?.password && <div className={classes.error}> {errors.password.message}</div>
                        || getError('password') && <div className={classes.error}> {`Password ${getError('password')}`}</div>}
                        
                    </div>
                    <div className={classes.repeatPassword}>Repeat password
                        <input 
                         placeholder="Repeat password"
                         type="password"
                        { ...register('repeatPassword', {
                            required: 'Repeat password is require field',
                            validate: value =>
                                 value === watch('password') || "The passwords do not match"
                         })} 
                        />
                        {errors?.repeatPassword && <div className={classes.error}> {errors.repeatPassword.message}</div>}
                    </div>
                    <div className={classes.terms}>
                        <input type="checkbox" 
                                id='terms'
                                {
                                    ...register('terms',
                                    {
                                        required: "You must agree to terms"
                                    })
                                }/>
                               {errors?.terms && <div className={classes.error}> {errors.terms.message}</div>}
                        <label htmlFor ='terms'>I agree to the processing of my personal information</label>
                    </div>
                    <input type='submit' value="Create" className={classes.create}></input>
                    
                </div>
                <div className={classes.haveAccount}>Already have an account? <Link to='/authorization'>Sign In.</Link></div>
            </form>
        </>
    )
}