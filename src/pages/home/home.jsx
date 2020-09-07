import React from 'react';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux'
import { setNavToggle } from '../../store/nav/actions'
import * as firebase from 'firebase';

function Home({ setNavToggle }) {

    const dispatch = useDispatch()

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                dispatch(setNavToggle(false))
            }
        })
    }, [])

    return (
        <div className='content'>
            <div className="how_it_work">
                <div className="content_header">
                    <div className="how_it_work_text">
                        <h1>How it works</h1>
                        <p>Lorem ipsum dolor sit amet dan aku akan.</p>
                    </div>
                    <button className="start_uploading_btn">Start Uploading</button>
                </div>
                <div className="content_footer">
                    <div className="card">
                        <div className="card_image"></div>
                        <h1>1. Upload files</h1>
                        <p>Upload up to 2GB of documents to our secure server for easy access anywhere</p>
                    </div>
                    <div className="card">
                        <div className="card_image"></div>
                        <h1>1. Upload files</h1>
                        <p>Upload up to 2GB of documents to our secure server for easy access anywhere</p>
                    </div>
                    <div className="card">
                        <div className="card_image"></div>
                        <h1>1. Upload files</h1>
                        <p>Upload up to 2GB of documents to our secure server for easy access anywhere</p>
                    </div>
                    <div className="card">
                        <div className="card_image"></div>
                        <h1>1. Upload files</h1>
                        <p>Upload up to 2GB of documents to our secure server for easy access anywhere</p>
                    </div>
                </div>
            </div>

            <div className="library">
                <div className="content_header">
                    <div className="how_it_work_text">
                        <h1>Browse our legal document library</h1>
                        <p>Over 1,000 attorney-approved legal documents</p>
                    </div>
                    <button className="start_uploading_btn">Browse Library</button>
                </div>
                <div className="content_footer">
                    <div className="document_card">
                        <div className="document_image"></div>
                        <h1>NDA</h1>
                        <p>Lorem ipsum</p>
                    </div>
                    <div className="document_card">
                        <div className="document_image"></div>
                        <h1>NDA</h1>
                        <p>Lorem ipsum</p>
                    </div>
                    <div className="document_card">
                        <div className="document_image"></div>
                        <h1>NDA</h1>
                        <p>Lorem ipsum</p>
                    </div>
                    <div className="document_card">
                        <div className="document_image"></div>
                        <h1>NDA</h1>
                        <p>Lorem ipsum</p>
                    </div>
                    <div className="document_card">
                        <div className="document_image"></div>
                        <h1>NDA</h1>
                        <p>Lorem ipsum</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({ nav }) => {
    return { nav }
}

const mapDispatchToProps = {
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);