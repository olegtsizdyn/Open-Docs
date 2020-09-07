import React from 'react';
import { useEffect } from 'react';
import * as firebase from 'firebase';
import { useState } from 'react';
import Modal from 'react-modal';
import { ReactComponent as File } from '../../shared/images/svg/file.svg';
import { ReactComponent as Delete } from '../../shared/images/svg/delete.svg';
import { ReactComponent as Edit } from '../../shared/images/svg/edit.svg';
import { ReactComponent as Close } from '../../shared/images/svg/close.svg';
import { connect, useDispatch } from 'react-redux'
import { setNavToggle } from '../../store/nav/actions'
import { Redirect } from 'react-router-dom';

function Documents({ setNavToggle }) {

    const [isActiveCreateFile, setIsActiveCreateFile] = useState(false);
    const [isActiveEditFile, setIsActiveEditFile] = useState(false);
    const [documentArray, setDocumentArray] = useState([]);
    const [fireBaseLength, setFireBaseLength] = useState();
    const db = firebase.firestore();

    const dispatch = useDispatch();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                getFireBase()
                dispatch(setNavToggle(false))
            } else {
                return <Redirect to="/home" />;
            }
        })
    }, [])

    const getFireBase = () => {
        db.collection("documents")
            .orderBy('id')
            .get()
            .then(function (querySnapshot) {
                const newDocumentArray = [];
                setContextMenuState(undefined)
                querySnapshot.forEach(function (doc) {
                    newDocumentArray.push({ ...doc.data() })
                });
                setDocumentArray(newDocumentArray);
                if (querySnapshot.size !== 0) {
                    setFireBaseLength(newDocumentArray[newDocumentArray.length - 1].id);
                } else {
                    setFireBaseLength('0')
                }
            })
    }

    const toggleModalCreateFile = () => {
        setIsActiveCreateFile(!isActiveCreateFile);
        Modal.setAppElement('body');
    }

    const toggleModalEditFile = () => {
        setIsActiveEditFile(!isActiveEditFile);
        Modal.setAppElement('body');
    }

    const [fileTitle, setFileTitle] = useState('');

    const addFile = () => {
        if (fileTitle) {
            db.collection("documents")
                .add({
                    id: +fireBaseLength + 1,
                    document: fileTitle,
                    lastEdit: "not edited",
                    permission: '-',
                    signed: 'Only you',
                    size: '18'
                })
                .then(
                    setFileTitle(''),
                    getFireBase()
                )
        }
    }

    const removeAllItemFireBase = () => {
        db.collection('documents')
            .orderBy('id')
            .get()
            .then(item => {
                item.forEach(doc => {
                    for (let i = 0; i < arraySelectedItem.length; i++) {
                        if (+arraySelectedItem[i] === doc.data().id) {
                            doc.ref.delete();
                        }
                    }
                    getFireBase()
                })
                setSelectedItems([])
            })
    }

    const [selectedItems, setSelectedItems] = useState(false);
    const [arraySelectedItem, setArraySelectedItem] = useState([]);

    const addSelectItems = (e) => {
        if (e.checked) {
            console.log(e.value, e.id);
            setArraySelectedItem(arraySelectedItem.concat(e.value));
            if (arraySelectedItem.length >= 1) {
                setSelectedItems(true);
            } else {
                setSelectedItems(false);
            }
        } else if (!e.checked) {
            for (let i = 0; i < arraySelectedItem.length; i++) {
                setArraySelectedItem(arraySelectedItem.filter(item => item !== arraySelectedItem[i]))
            }
            if (arraySelectedItem.length < 3) {
                setSelectedItems(false);
            } else {
                setSelectedItems(true);
            }
        }
    }

    const removeItem = (e) => {
        db.collection('documents')
            .orderBy('id')
            .get()
            .then(item => {
                if (item.size === 1) {
                    item.forEach(doc => {
                        if (+e === doc.data().id) {
                            doc.ref.delete();
                            setContextMenuState(undefined);
                        }
                        getFireBase();
                    })
                } else {
                    item.forEach(doc => {
                        if (+e === doc.data().id) {
                            doc.ref.delete();
                            setContextMenuState(undefined);
                        }
                    })
                    getFireBase();
                }
            })
    }

    const [contextMenuState, setContextMenuState] = useState();

    const toggleContextMenu = (e) => {
        if (e.id === contextMenuState) {
            setContextMenuState(undefined)
        } else {
            setContextMenuState(e.id)
        }
    }

    const [idEditItem, setIdEditItem] = useState();
    const [editFileTitle, setEditFileTitle] = useState();

    const editItem = (e) => {
        db.collection('documents')
            .orderBy('id')
            .get()
            .then(item => {
                item.forEach(doc => {
                    if (+e === doc.data().id) {
                        setEditFileTitle(doc.data().document)
                        setIdEditItem(e);
                        toggleModalEditFile()
                        setContextMenuState(undefined)
                    }
                })
            })
    }

    const saveFile = () => {
        db.collection('documents')
            .orderBy('id')
            .get()
            .then(item => {
                item.forEach(doc => {
                    if (+idEditItem === doc.data().id) {
                        doc.ref.update({ document: editFileTitle });
                        toggleModalEditFile()
                        setEditFileTitle('')
                    }
                })
                getFireBase()
            })
    }

    return (
        <div className="content">
            <h1>My Documents</h1>
            <div className="content_wrapper">
                <div className="table_wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="checkedAllItem" />
                                    <label for="checkedAllItem">Document</label>
                                </th>
                                <th>Last Edited</th>
                                <th>Signed</th>
                                <th>Permission</th>
                                <th>Size</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentArray.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type="checkbox" id={item.id} value={item.id} onChange={(e) => addSelectItems(e.target)} />
                                        <label for={item.id}>
                                            <File /> {item.document}</label>
                                    </td>
                                    <td>{item.lastEdit}</td>
                                    <td>{item.permission}</td>
                                    <td>{item.signed}</td>
                                    <td>{item.size}KB</td>
                                    <td>
                                        <div className="dotted_wrapper">
                                            <div className="dotted" id={index} onClick={(e) => toggleContextMenu(e.target)} style={{ zIndex: `${+contextMenuState === index ? '999' : ''}` }}></div>
                                            {+contextMenuState === index &&
                                                <div className="context_menu_active">
                                                    <p id={item.id} onClick={(e) => removeItem(e.target.id)}><Delete />Delete</p>
                                                    <p id={item.id} onClick={(e) => editItem(e.target.id)}><Edit />Edit</p>
                                                </div>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="navigation_wrapper_table">
                    <div className="drop_file">
                        <p>Select a File to Preview</p>
                    </div>
                    <button className="create_file" onClick={toggleModalCreateFile}>Create</button>
                    {selectedItems &&
                        <div className="delete_all_file_wrapper" onClick={removeAllItemFireBase}>
                            <div className="delete_icon"></div>
                            <p>Delete all items</p>
                        </div>
                    }
                </div>
            </div>

            {/* Create file */}
            <Modal isOpen={isActiveCreateFile} onRequestClose={toggleModalCreateFile} className="modal" overlayClassName="overlay">
                <div className="modal_create_file_wrapper">
                    <div>
                        <Close onClick={toggleModalCreateFile} />
                    </div>
                    <h1>Create new file</h1>
                    <div className="input_wrapper">
                        <label>Title</label>
                        <input type="text" placeholder="Title" value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} />
                    </div>
                    <button className="create_file_btn" onClick={addFile}>Create file</button>
                </div>
            </Modal>

            {/* Edit file */}
            <Modal isOpen={isActiveEditFile} onRequestClose={toggleModalEditFile} className="modal" overlayClassName="overlay">
                <div className="modal_create_file_wrapper">
                    <div>
                        <Close onClick={toggleModalEditFile} />
                    </div>
                    <h1>Edit file</h1>
                    <div className="input_wrapper">
                        <label>Title</label>
                        <input type="text" placeholder="Title" value={editFileTitle} onChange={(e) => setEditFileTitle(e.target.value)} />
                    </div>
                    <button className="create_file_btn" onClick={saveFile}>Save</button>
                </div>
            </Modal>
        </div>
    );
}

const mapStateToProps = ({ nav }) => {
    return { nav }
}

const mapDispatchToProps = {
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);