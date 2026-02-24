import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Folder, File as FileIcon, Upload, HardDrive, ArrowLeft, Plus, Save, X, User, Share2 } from 'lucide-react';
import Auth from './Auth';
import PlanSelection from './PlanSelection';
import Navbar from './Navbar';
import Home from './Home';
import Profile from './profile';
import './App.css';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("untitled.txt");
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);

  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5000/api/folders/${user.id}`)
        .then(res => res.json())
        .then(data => setFolders(data))
        .catch(() => setAlertModal({ show: true, title: 'Error', message: 'Failed to load folders.' }));

      fetch(`http://localhost:5000/api/files/${user.id}`)
        .then(res => res.json())
        .then(data => setFiles(data))
        .catch(() => setAlertModal({ show: true, title: 'Error', message: 'Failed to load files.' }));
    } else {
      setFolders([]);
      setFiles([]);
    }
  }, [user]);

  const handleAuthSuccess = (userData, isSignUp) => {
    if (isSignUp) {
      setUser({ id: userData.id, name: userData.username, plan: null });
      navigate('/choose-plan');
    } else {
      setUser({ id: userData.id, name: userData.username, plan: userData.plan || 'Standard' });
      navigate('/dashboard');
    }
  };

  const handlePlanSelect = (plan) => {
    if (user) {
      setUser({ ...user, plan: plan.name });
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, permission: 'viewer' })
      });
      const data = await response.json();
      if (response.ok) {
        setShareData({ id: data.share_id, link: data.link });
        setShowShareModal(true);
      } else {
        setAlertModal({ show: true, title: 'Share Failed', message: 'Failed to generate share link.' });
      }
    } catch (err) {
      setAlertModal({ show: true, title: 'Connection Error', message: 'Failed to connect to the share server.' });
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user.id);
      formData.append('folderId', currentFolder !== null ? currentFolder : 'null');

      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          let sizeStr = "";
          if (selectedFile.size < 1024) {
            sizeStr = selectedFile.size + " B";
          } else if (selectedFile.size < 1024 * 1024) {
            sizeStr = (selectedFile.size / 1024).toFixed(1) + " KB";
          } else {
            sizeStr = (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB";
          }

          const extMatch = selectedFile.name.match(/\.([^.]+)$/);
          const fileType = extMatch ? extMatch[1] : "file";

          const newFile = {
            id: data.dbFileId,
            name: selectedFile.name,
            size: sizeStr,
            type: fileType,
            folderId: currentFolder,
            content: `Google Drive File ID: ${data.fileId}`
          };
          setFiles((prev) => [...prev, newFile]);
          setAlertModal({ show: true, title: 'Success', message: 'File uploaded and saved to database successfully.' });
        } else {
          setAlertModal({ show: true, title: 'Upload Failed', message: data.error || 'The server rejected the file.' });
        }
      } catch (error) {
        setAlertModal({ show: true, title: 'Connection Error', message: 'Failed to connect to the backend server.' });
      }
    }
    e.target.value = null;
  };

  const triggerCreateFolder = () => {
    setNewFolderName("");
    setShowFolderModal(true);
  };

  const confirmCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const response = await fetch('http://localhost:5000/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newFolderName.trim(), userId: user.id })
        });
        const data = await response.json();
        setFolders((prev) => [...prev, { id: data.id, name: data.name }]);
      } catch (err) {
        setAlertModal({ show: true, title: 'Error', message: 'Failed to create folder in database.' });
      }
    }
    setShowFolderModal(false);
  };

  const triggerCreateFile = () => {
    setNewFileName("untitled.txt");
    setShowFileModal(true);
  };

  const confirmCreateFile = async () => {
    if (newFileName.trim()) {
      const extMatch = newFileName.match(/\.([^.]+)$/);
      const fileType = extMatch ? extMatch[1] : "txt";

      try {
        const response = await fetch('http://localhost:5000/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newFileName.trim(),
            size: "0 KB",
            userId: user.id,
            folderId: currentFolder,
            content: ""
          })
        });
        const data = await response.json();
        
        const newFile = {
          id: data.id,
          name: newFileName.trim(),
          size: "0 KB",
          type: fileType,
          folderId: currentFolder,
          content: ""
        };
        setFiles((prev) => [...prev, newFile]);
        openFile(newFile);
      } catch (err) {
        setAlertModal({ show: true, title: 'Error', message: 'Failed to create file in database.' });
      }
    }
    setShowFileModal(false);
  };

  const openFile = (file) => {
    setEditingFile(file);
    setFileContent(file.content || "");
  };

  const saveFile = async () => {
    const safeContent = fileContent || "";
    const newSize = safeContent.length < 1024 ? `${safeContent.length} B` : `${(safeContent.length / 1024).toFixed(1)} KB`;
    
    try {
      await fetch(`http://localhost:5000/api/files/${editingFile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: safeContent, size: newSize })
      });
      
      setFiles(files.map(f => {
        if (f.id === editingFile.id) {
          return { ...f, content: safeContent, size: newSize };
        }
        return f;
      }));
      setEditingFile(null);
      setFileContent("");
    } catch (err) {
      setAlertModal({ show: true, title: 'Error', message: 'Failed to save file to database.' });
    }
  };

  const displayedFiles = files.filter(f => (f.folderId || null) === currentFolder);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      {alertModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc', marginBottom: '16px' }}>{alertModal.title}</h3>
            <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.5' }}>{alertModal.message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAlertModal({ show: false, title: '', message: '' })} style={{ background: '#818cf8', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && shareData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', width: '360px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc', marginBottom: '16px' }}>Drive Shared Successfully</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Share ID</label>
              <div style={{ padding: '8px 12px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', color: '#f8fafc', border: '1px solid var(--border)' }}>{shareData.id}</div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Shareable Link</label>
              <div style={{ padding: '8px 12px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', color: '#818cf8', border: '1px solid var(--border)', wordBreak: 'break-all' }}>{shareData.link}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowShareModal(false)} style={{ background: '#818cf8', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {showFileModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc', marginBottom: '16px' }}>Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g., notes.txt"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', marginBottom: '24px', boxSizing: 'border-box' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowFileModal(false)} style={{ background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              <button onClick={confirmCreateFile} style={{ background: '#818cf8', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Create File</button>
            </div>
          </div>
        </div>
      )}

      {showFolderModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc', marginBottom: '16px' }}>Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', marginBottom: '24px', boxSizing: 'border-box' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowFolderModal(false)} style={{ background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              <button onClick={confirmCreateFolder} style={{ background: '#818cf8', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Create Folder</button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PlanSelection readOnly={true} />} />
        <Route path="/choose-plan" element={<PlanSelection onPlanSelect={handlePlanSelect} readOnly={false} />} />
        <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} defaultIsLogin={true} />} />
        <Route path="/signup" element={<Auth onAuthSuccess={handleAuthSuccess} defaultIsLogin={false} />} />
        <Route 
          path="/profile" 
          element={
            user ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-color)' }}>
                <Profile user={user} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user && user.plan ? (
              <div className="container">
                <div className="sidebar">
                  <div 
                    className={`nav-item active`} 
                    onClick={() => { setCurrentFolder(null); setEditingFile(null); }}
                  >
                    <HardDrive size={20}/> My Drive
                  </div>
                  <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    {folders.map(f => (
                      <div 
                        key={f.id} 
                        className={`nav-item ${currentFolder === f.id && !editingFile ? 'active' : ''}`}
                        style={{ padding: '8px 12px', fontSize: '14px', marginBottom: 0 }}
                        onClick={() => { setCurrentFolder(f.id); setEditingFile(null); }}
                      >
                        <Folder size={16} /> {f.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="main">
                  <div className="dashboard-welcome" style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(129, 140, 248, 0.3)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0 }}>Welcome back, <span style={{ color: '#818cf8' }}>{user.name}</span>!</h2>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>You are currently on the <strong>{user.plan}</strong></p>
                    </div>
                    <button className="upload-btn" style={{ background: '#818cf8', color: '#fff', border: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }} onClick={handleShare}>
                      <Share2 size={18} /> Share Drive
                    </button>
                  </div>

                  {editingFile ? (
                    <div className="editor-wrapper">
                      <div className="editor-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FileIcon size={24} color="#818cf8" />
                          <h3 style={{ margin: 0 }}>{editingFile.name}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={saveFile} className="upload-btn" style={{ padding: '8px 16px' }}>
                            <Save size={16} /> Save File
                          </button>
                          <button onClick={() => setEditingFile(null)} className="upload-btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #fca5a5', color: '#fca5a5' }}>
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      </div>
                      <textarea 
                        className="editor-textarea" 
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        placeholder="Start typing your document here..."
                      />
                    </div>
                  ) : (
                    <>
                      <header className="header">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          style={{ display: 'none' }} 
                          onChange={handleFileChange} 
                        />
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <button className="upload-btn" onClick={triggerFileUpload}>
                            <Upload size={18} /> Upload PC File
                          </button>
                          <button className="upload-btn" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', border: '1px solid #818cf8' }} onClick={triggerCreateFile}>
                            <Plus size={18} /> Create File
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <button onClick={triggerCreateFolder} style={{ cursor: 'pointer', color: '#f8fafc', border: '1px solid var(--border)', background: 'var(--card-bg)', padding: '10px 16px', borderRadius: '12px', fontWeight: '600', fontSize: '14px' }}>
                            + New Folder
                          </button>
                        </div>
                      </header>
                      <section>
                        {currentFolder === null ? (
                          <>
                            <div className="folder-grid">
                              {folders.map(f => (
                                <div key={f.id} className="folder-card" onClick={() => setCurrentFolder(f.id)}>
                                  <Folder color="#818cf8" fill="#818cf8" size={48} />
                                  <div className="folder-name">{f.name}</div>
                                </div>
                              ))}
                            </div>
                            <h3 style={{ marginTop: '32px' }}>Root Files</h3>
                          </>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <button onClick={() => setCurrentFolder(null)} style={{ background: 'transparent', border: 'none', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}>
                              <ArrowLeft size={24} />
                            </button>
                            <h3 style={{ margin: 0 }}>{folders.find(f => f.id === currentFolder)?.name}</h3>
                          </div>
                        )}
                        
                        <div className="file-list">
                          {displayedFiles.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>This folder is empty. Create or upload a file.</div>
                          ) : (
                            displayedFiles.map(file => (
                              <div key={file.id} className="file-row" onClick={() => openFile(file)}>
                                <FileIcon size={24} color="#94a3b8" />
                                <div className="file-info">{file.name}</div>
                                <div className="file-size">{file.size}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </section>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;