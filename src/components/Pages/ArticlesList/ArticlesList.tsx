import React,  {useState} from "react";
import { useGetArticlesQuery } from "../../../API/api";
import { ArticlePreview } from "../../ArticlePreview/ArticlePreview";
import { IArticle } from "../../../Interfaces/interfaces";
import { Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
import Loading from "../../Loading/loading";
import './articleList.module.scss'
import { PageNotFound } from "../PageNotFound/PageNotFound";

export const ArticlesList: React.FC = () => {
    const limit: number = 20;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const { data, isError, isLoading, error } = useGetArticlesQuery({limit, currentPage});

    if (isLoading) {
        return <Loading /> 
    }
    if(isError){
        return (<PageNotFound />)
    }
    if(!isLoading && data)
    return (
        <div>
            {data.articles.map((article: IArticle) => (
                <ArticlePreview key={article.slug} article={article} />
            ))}
            <Pagination 
                total={data.articlesCount}
                pageSize={limit}
                showSizeChanger={false}
                style={{ textAlign: 'center', marginBottom: '15px' , marginTop: '20px'}}
                current={currentPage}
                onChange={(page) => setSearchParams({ page: page.toString() })} />
        </div>
    );
    else{
        return(<PageNotFound />)
    }
};
