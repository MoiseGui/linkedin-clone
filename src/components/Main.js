import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getArticlesApi } from '../actions';
import PostModal from './PostModal';
import ReactPlayer from 'react-player';
import moment from 'moment';

function Main({ loading, user, getArticles, articles }) {
    const [showModal, setShowModal] = useState("close");

    useEffect(() => {
        if (user) {
            getArticles();
        }
    }, []);

    const handleShowModalClick = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;

        switch (showModal) {
            case "open":
                setShowModal("close");
                break;
            case "close":
                setShowModal("open");
                break;
            default:
                setShowModal("close");
                break;
        }
    }

    return (
        <Container>
            <ShareBox>
                <div>
                    {user && user.photoURL ? <img src={user.photoURL} alt="" /> : <img src="/images/user.svg" alt="" />}
                    <button
                        onClick={handleShowModalClick}
                        disabled={loading}
                    >Start a post</button>
                </div>
                <div>
                    <button
                        onClick={handleShowModalClick}
                        disabled={loading}>
                        <img src="/images/photo-icon.svg" alt="" />
                        <span>Photo</span>
                    </button>
                    <button
                        onClick={handleShowModalClick}
                        disabled={loading}>
                        <img src="/images/video-icon.svg" alt="" />
                        <span>Video</span>
                    </button>
                    <button
                        onClick={handleShowModalClick}
                        disabled={loading}>
                        <img src="/images/event-icon.svg" alt="" />
                        <span>Post</span>
                    </button>
                    <button
                        onClick={handleShowModalClick}
                        disabled={loading}>
                        <img src="/images/article-icon.svg" alt="" />
                        <span>Write Article</span>
                    </button>
                </div>
            </ShareBox>
            <Content>
                {loading && <img src="/images/loader.png" alt="" />}
                {articles.length > 0 ?
                    articles.map((article) => {
                        return (
                            <Article key={article.id}>
                                <SharedActor>
                                    <a>
                                        {article.actor.image ? <img src={article.actor.image} alt="" /> : <img src="/images/user.svg" alt="" />}
                                        <div>
                                            <span>{article.actor.title}</span>
                                            <span>{article.actor.description}</span>
                                            <span>{article.date ? moment(article.date.toDate()).fromNow() : "..."}</span>
                                        </div>
                                    </a>
                                    <button>
                                        <img src="/images/ellipsis.svg" alt="" />
                                    </button>
                                </SharedActor>
                                <Description>
                                    <p>{article.description}</p>
                                    {article.sharedImg !== "" &&
                                        <SharedImg>
                                            <a>
                                                <img src={article.sharedImg} alt="" />
                                            </a>
                                        </SharedImg>
                                    }
                                    {article.video !== "" &&
                                        <ReactPlayer url={article.video} width="100%" />
                                    }
                                    <SocialCounts>
                                        <li>
                                            <button>
                                                <img src="/images/like-icon.svg" alt="" />
                                                <img src="/images/praise-icon.svg" alt="" />
                                                <span>75</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                <span>
                                                    <a>2 comments</a>
                                                </span>
                                            </button>
                                        </li>
                                    </SocialCounts>
                                    <SocialActions>
                                        <button>
                                            <img src="/images/like-react-icon.svg" alt="" />
                                            <span>Like</span>
                                        </button>
                                        <button>
                                            <img src="/images/comment-icon.svg" alt="" />
                                            <span>Comments</span>
                                        </button>
                                        <button>
                                            <img src="/images/share-icon.svg" alt="" />
                                            <span>Share</span>
                                        </button>
                                        <button>
                                            <img src="/images/send-icon.svg" alt="" />
                                            <span>Send</span>
                                        </button>
                                    </SocialActions>
                                </Description>
                            </Article>
                        );
                    })
                    : !loading && <p>No articles yet</p>
                }
            </Content>

            <PostModal showModal={showModal} handleShowModalClick={handleShowModalClick} />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        loading: state.articleState.loading,
        articles: state.articleState.articles,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getArticles: () => dispatch(getArticlesApi()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

const Container = styled.div`
    grid-area: main;
`;

const CommonCard = styled.div`
    text-align: center;
    overflow: hidden;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    border: none;
    box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonCard)`
    display: flex;
    flex-direction: column;
    color: #7E7E7E;
    margin: 0 0 8px;
    background: white;
    div {
        button {
            outline: none;
            color: #7E7E7E;
            font-size: 14px;
            line-height: 1.5;
            min-height: 48px;
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            font-weight: 600;
        }        
        &:first-child {
            display: flex;
            align-items: center;
            padding: 8px 16px 0px 16px;
            img {
                width: 48px;
                border-radius: 50%;
                margin-right: 10px;
            }
            button {
                margin: 4px 0;
                flex-grow: 1;
                border-radius: 35px;
                padding-left: 16px;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 35px;
                background-color: white;
                text-align: left;
                cursor: text;
            }
        }
        &:nth-child(2) {
            display:flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding-bottom: 4px;

            button {
                cursor: pointer;
                padding: 0px 10px 0px 10px;
                border-radius: 15px;
                img {
                    margin: 0 4px 0 -2px;
                }
                span {
                    color: #7E7E7E;
                    font-weight: 500;
                }

                &:hover {
                    background-color: #F5F5F5;
                }

                &:nth-child(1) {
                    img {
                        filter: invert(71%) sepia(77%) saturate(2039%) hue-rotate(181deg) brightness(100%) contrast(96%);
                    }
                }
                &:nth-child(2) {
                    img {
                        filter: invert(100%) sepia(33%) saturate(4255%) hue-rotate(37deg) brightness(93%) contrast(61%);
                    }
                }
                &:nth-child(3) {
                    img {
                        filter: invert(85%) sepia(55%) saturate(3844%) hue-rotate(330deg) brightness(97%) contrast(86%);
                    }
                }
                &:nth-child(4) {
                    img {
                        filter: invert(84%) sepia(19%) saturate(6922%) hue-rotate(311deg) brightness(109%) contrast(92%);
                    }
                }
            }
        }
    }
`;

const Article = styled(CommonCard)`
    padding: 0;
    margin: 0 0 8px;
    overflow: visible;
`;

const SharedActor = styled.div`
    padding-right: 40px;
    flex-wrap: nowrap;
    padding: 12px 16px 0;
    margin-bottom: 8px;
    align-items: center;
    display: flex;
    a {
        margin-right: 12px;
        flex-grow: 1;
        overflow: hidden;
        display: flex;
        text-decoration: none;
        img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
        }
        & >  div {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            flex-basis: 0;
            margin-left: 8px;
            overflow: hidden;
            span {
                text-align: left;
                &:first-child {
                    font-size: 14px;
                    font-weight: 700;
                    color: rgba(0, 0, 0, 1);
                }

                &:nth-child(n+1) {
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.6);
                }
            }
        }
    }

    button {
        position: absolute;
        right: 12px;
        top: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
    }
`;

const Description = styled.div`
    p {
        color: #191919;
        padding: 5px 16px;
    }
    overflow: hidden;
    color: rgba(0, 0, 0, 0.9);
    font-size: 14px;
    text-align: left;
`;

const SharedImg = styled.div`
    margin-top: 8px;
    width: 100%;
    display: block;
    position: relative;
    background-color: #f9fafb;
    img {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
`;

const SocialCounts = styled.ul`
    line-height: 1.3;
    display: flex;
    justify-content: flext-start;
    align-items: center;
    overflow: auto;
    margin: 0 16px;
    padding: 8px 0;
    border-bottom: 1px solid #e9e5df;
    list-style: none;
    li {
        margin-right: 5px;
        font-size: 12px;
        button {
            color: #5E5E5E;
            display: flex;
            border: none;
            background: transparent;
        }
    }
`;

const SocialActions = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin: 0;
    min-height: 40px;
    padding: 4px 8px;
    button {
        display: inline-flex;
        align-items: center;
        padding: 8px;
        color: #5E5E5E;
        border: none;
        background: transparent;
        cursor: pointer;
        
        &:hover {
            background-color: #EBEBEB;
            border-radius: 5px;
        }

        @media(min-width: 768px){
            span{
                margin-left: 8px;
            }
        }

        img {
            filter: invert(36%) sepia(1%) saturate(2591%) hue-rotate(10deg) brightness(98%) contrast(88%);
        }
    }
`;

const Content = styled.div`
    text-align: center;
    & > img {
        width: 30px;
    }
`;
