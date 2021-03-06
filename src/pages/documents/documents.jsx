import React from 'react';
import { useEffect } from 'react';
import * as firebase from 'firebase';
import { useState } from 'react';
import Modal from 'react-modal';
import { ReactComponent as File } from '../../shared/images/svg/file.svg';
import { ReactComponent as Delete } from '../../shared/images/svg/delete.svg';
import { ReactComponent as Edit } from '../../shared/images/svg/edit.svg';
import { ReactComponent as Close } from '../../shared/images/svg/close.svg';
import Loader from '../../shared/images/svg/loader.svg';
import { connect, useDispatch } from 'react-redux'
import { setNavToggle } from '../../store/nav/actions'
import { reduxForm, Field } from 'redux-form';
import { required } from '../../common/validators';

function Documents({ setNavToggle }) {

    const [isActiveCreateFile, setIsActiveCreateFile] = useState(false);
    const [isActiveEditFile, setIsActiveEditFile] = useState(false);
    const [documentArray, setDocumentArray] = useState([]);
    const [fireBaseLength, setFireBaseLength] = useState();
    const db = firebase.firestore();

    const dispatch = useDispatch();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            getFireBase()
            dispatch(setNavToggle(false))
        })
    }, [])

    const [loaderState, setLoaderState] = useState(true);

    const getFireBase = () => {
        db.collection("documents")
            .orderBy('id', 'desc')
            .get()
            .then(function (querySnapshot) {
                const newDocumentArray = [];
                setContextMenuState(undefined)
                querySnapshot.forEach(function (doc) {
                    newDocumentArray.push({ ...doc.data() })
                });
                setDocumentArray(newDocumentArray);
                if (querySnapshot.size !== 0) {
                    setFireBaseLength(newDocumentArray[0].id);
                } else {
                    setFireBaseLength('0')
                }
                setLoaderState(false)
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

    const addFile = (data) => {
        setLoaderState(true);
        db.collection("documents")
            .add({
                id: +fireBaseLength + 1,
                document: data.fileName,
                lastEdit: "not edited",
                permission: '-',
                signed: 'Only you',
                size: '18'
            })
            .then(
                getFireBase(),
                setIsActiveCreateFile(false),
                setLoaderState(false)
            )
    }

    const removeAllItemFireBase = () => {
        db.collection('documents')
            .orderBy('id', 'desc')
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
        setLoaderState(true)
        db.collection('documents')
            .orderBy('id', 'desc')
            .get()
            .then(item => {
                if (item.size === 1) {
                    item.forEach(doc => {
                        if (+e === doc.data().id) {
                            doc.ref.delete();
                            setContextMenuState(undefined);
                            getFireBase();
                            setLoaderState(false)
                        }
                    })
                } else {
                    item.forEach(doc => {
                        if (+e === doc.data().id) {
                            doc.ref.delete();
                            setContextMenuState(undefined);
                            getFireBase();
                            setLoaderState(false)
                        }
                    })
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
            .orderBy('id', 'desc')
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
        setLoaderState(true)
        db.collection('documents')
            .orderBy('id', 'desc')
            .get()
            .then(item => {
                item.forEach(doc => {
                    if (+idEditItem === doc.data().id) {
                        doc.ref.update({ document: editFileTitle });
                        toggleModalEditFile()
                        setEditFileTitle('')
                        getFireBase()
                    }
                })
            })
            .then(
                getFireBase(),
            )
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

                        {loaderState
                            ? <tbody>
                                <div className="loader">
                                    <img src={Loader} />
                                </div>
                              </tbody>
                            : <tbody>
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
                        }
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
                    <ModalFormRedux onSubmit={addFile} />
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

const ModalForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="input_wrapper">
                <Field name="fileName" type="text" component={renderField} label="Title" placeholder="Title" validate={required} />
            </div>
            <button>Submit</button>
        </form>
    )
}

const ModalFormContainer = reduxForm({ form: "modalForm" })(ModalForm)

const ModalFormRedux = reduxForm({
    form: 'modalForm'
})(ModalForm)

const renderField = ({
    input,
    label,
    type,
    placeholder,
    meta: { touched }
}) => (
        <div>
            <label>{label}</label>
            <div>
                <input {...input} placeholder={placeholder} type={type} className={touched && !input.value ? "error_input" : ""} />
            </div>
        </div>
    )

const mapStateToProps = ({ nav }) => {
    return { nav }
}

const mapDispatchToProps = {
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);