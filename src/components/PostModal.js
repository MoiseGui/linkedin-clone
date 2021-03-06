import styled from 'styled-components';
import { useState } from 'react';
import { connect } from 'react-redux'
import ReactPlayer from 'react-player';
import { postArticleApi } from '../actions';
import { serverTimestamp } from '@firebase/firestore';

export const PostModal = ({ showModal, handleShowModalClick, user, postArticleApi }) => {
    const [editorText, setEditorText] = useState('');
    const [shareImage, setShareImage] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [assetArea, setAssetArea] = useState('');

    const handleChange = (e) => {
        const image = e.target.files[0];

        if (image === "" || image === undefined) {
            alert(`Please select an image, the file is a ${typeof image}`);
            return;
        }
        setShareImage(image);
    }

    const switchAssetArea = (area) => {
        setShareImage('');
        setVideoLink('');
        setAssetArea(area);
    }

    const postArticle = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;

        const payload = {
            image: shareImage,
            video: videoLink,
            user: user,
            description: editorText,
            timestamp: serverTimestamp()
        }

        postArticleApi(payload);
        reset(e);
    }

    const reset = e => {
        setEditorText('');
        setShareImage('');
        setVideoLink('');
        handleShowModalClick(e);
    }

    return (
        <>
            {showModal === "open" &&
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a post</h2>
                            <button onClick={e => reset(e)}><img src="/images/close-icon.svg" alt="" /></button>
                        </Header>
                        <SharedContent>
                            <UserInfo>
                                {user.photoURL ?
                                    <img src={user.photoURL} alt="" />
                                    :
                                    <img src="/images/user.svg" alt="" />}
                                <span>{user.displayName ? user.displayName : 'Hi there'}</span>
                            </UserInfo>
                            <Editor>
                                <textarea
                                    value={editorText}
                                    onChange={(e) => setEditorText(e.target.value)}
                                    placeholder="What do you want to talk about?"
                                    autoFocus={true}
                                />
                                {assetArea === 'image' ?
                                    <UploadImage>
                                        <input
                                            type="file"
                                            name="image"
                                            id="file"
                                            accept="image/gif, image/jpeg, image/png"
                                            style={{ display: 'none' }}
                                            onChange={handleChange}
                                        />
                                        <p>
                                            <label
                                                htmlFor="file"
                                                style={{ cursor: 'pointer' }}>Select an image to share</label>
                                        </p>
                                        {shareImage && <img src={URL.createObjectURL(shareImage)} alt="" />}
                                    </UploadImage>
                                    :
                                    assetArea === 'media' &&
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Please input a video link"
                                            value={videoLink}
                                            onChange={(e) => setVideoLink(e.target.value)}
                                        />
                                        {videoLink && <ReactPlayer url={videoLink} width="100%" />}
                                    </>
                                }
                            </Editor>
                        </SharedContent>
                        <ShareCreation>
                            <AttachAssets>
                                <AssetButton onClick={() => switchAssetArea('image')}>
                                    <img src="/images/share-image.svg" alt="" />
                                </AssetButton>
                                <AssetButton onClick={() => switchAssetArea('media')}>
                                    <img src="/images/share-video.svg" alt="" />
                                </AssetButton>
                            </AttachAssets>
                            <ShareComment>
                                <AssetButton>
                                    <img src="/images/share-comment.svg" alt="" />
                                    <span>Anyone</span>
                                </AssetButton>
                            </ShareComment>

                            <PostButton onClick={e => postArticle(e)} disabled={!editorText ? true : false} >Post</PostButton>
                        </ShareCreation>
                    </Content>
                </Container>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    user: state.userState.user
})

const mapDispatchToProps = (dispatch) => ({
    postArticleApi: (payload) => dispatch(postArticleApi(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostModal)

const Container = styled.div`
    Position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    color: black;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s;
`;

const Content = styled.div`
    width: 100%;
    max-width: 512px;
    background-color: white;
    max-height: 90%;
    overflow-y: initial;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 32px;
    margin: 0 auto;
`;

const Header = styled.div`
    /* display: block; */
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
        height: 40px;
        width: 40px;
        min-width: auto;
        color: rgba(0, 0, 0, 0.15);
        background-color: transparent;
        border: none;
        cursor: pointer;
        img, svg {
            filter: invert(41%) sepia(0%) saturate(0%) hue-rotate(192deg) brightness(95%) contrast(90%);
            pointer-events: none;
        }
    }
`;

const SharedContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    vertical-align: baseline;
    background-color: transparent;
    padding: 8px 12px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    svg, img {
        width: 48px;
        height: 48px;
        background-clip: content-box;
        border: 2px solid transparent;
        border-radius: 50%;
    }
    span {
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-left: 5px;
    }
`;

const ShareCreation = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
    display: flex;
    align-items: center;
    height: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.5);
    border: none;
    background-color: transparent;
    cursor: pointer;
    span {
        margin-left: 5px;
    }
    img {
        filter: invert(53%) sepia(17%) saturate(25%) hue-rotate(341deg) brightness(91%) contrast(92%);
    }
`;

const AttachAssets = styled.div`
    display: flex;
    align-items: center;
    padding-right: 8px;
    ${AssetButton} {
        width: 40px;
    }
`;

const ShareComment = styled.div`
    padding-left: 8px;
    margin-right: auto;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    ${AssetButton} {
        img {
            filter: invert(53%) sepia(17%) saturate(25%) hue-rotate(341deg) brightness(91%) contrast(92%);
        }
        svg {
            margin-right: 5px;
        }
    }
`;

const PostButton = styled.button`
    min-width: 60px;
    border-radius: 20px;
    padding-left: 16px;
    padding-right: 16px;
    background-color: ${props => props.disabled ? '#EBEBEB' : '#0a66c2'};
    border: none;
    color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.5)' : 'white'};
    cursor: pointer;
    &:hover {
        background-color: ${props => props.disabled ? '#EBEBEB' : '#004182'};
    }
`;

const Editor = styled.div`
    padding: 12px 24px;
    textarea {
        width: 100%;
        min-height: 100px;
        resize: none;
        border: none;
        outline: none;
    }
    input {
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-bottom: 20px;
    }
`;

const UploadImage = styled.div`
    text-align: center;
    p {
        padding: 12px 24px;
        font-size: 25px;
        color: rgba(0, 0, 0, 0.8);
    }
    img {
        width: 100%;
    }
`;