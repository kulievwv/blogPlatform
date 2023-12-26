import React, {useEffect} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import classes from './editProfile.module.scss'
import { IEditProfileFields } from "../../../Interfaces/interfaces";
import { useEditProfileMutation } from "../../../API/api";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../../../Redux/store";


export const EditProfile: React.FC = () => {

    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/authorization', { replace: true });
        }
    }, [isLoggedIn, navigate]);
   
    
    const [editProfile, { data, error, isLoading, isSuccess, isError }] = useEditProfileMutation()
    
    const {
        register, 
        handleSubmit, 
        formState: {errors},
        reset
    } = useForm<IEditProfileFields>({
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            image: ''
        }
    });

    useEffect(() => {
        if (data && data.user) {
          reset({
            username: data.user.username,
            email: data.user.email,
            password: data.user.password,
            image: data.user.image
          });
        }
      }, [data, reset]);

    const typedError = error as { status: number; data: { errors: Record<string, string> } };
    const getError = (fieldName: string) => {
        if (typedError && typedError.data && typedError.data.errors) {
            return typedError.data.errors[fieldName];
        }
        return null;
    };
    const onSubmit:SubmitHandler<IEditProfileFields> = (user) => {
        editProfile({ 'user':{
                    'email': user.email,
                    'password': user.password,
                    'bio': '',
                    'image': user.image,
                    'username': user.username
                }})
                .unwrap()
                .then((payload) => {
                    Cookies.set('token', payload.user.token, { expires: 7, path: '/' })
                    navigate('/articles', { replace: true })

                })
                .catch((error) => {
                    console.log(error)
                });

        
    }
    return(
         <form className={classes.form}
                     onSubmit={handleSubmit(onSubmit)}
                    >
                <div className={classes.title}>Edit profile</div>
                <div className={classes.inputs}>
                    <div className={classes.username}>Username
                        <input 
                        placeholder="Username"
                        // value={data?.user.username}//эта строчка заполнит правильно? 
                        autoComplete="no"
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
                         autoComplete="no"
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
                         placeholder="New password"
                         type="password"
                        
                        { ...register('password', {
                            required: 'New password is require field',
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
                    <div className={classes.image}>Avatar image(url)
                        <input 
                         placeholder="Avatar image"
                        { ...register('image')} 
                        />
                        
                        
                    </div>
                    <input type='submit' value="Save" className={classes.create}></input>
                    
                </div>
        </form>
    )
}