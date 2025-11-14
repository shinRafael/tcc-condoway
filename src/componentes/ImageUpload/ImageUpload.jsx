"use client";
import { useState, useRef } from 'react';
import styles from './ImageUpload.module.css';
import { FiCamera, FiX } from 'react-icons/fi';

export default function ImageUpload({ 
  onImageSelect, 
  currentImage = null,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png']
}) {
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    console.log('📁 Arquivo selecionado:', file.name, file.type, file.size);

    // Validar tipo de arquivo
    if (!acceptedFormats.includes(file.type)) {
      setError('Por favor, selecione apenas arquivos de imagem (JPG, JPEG, PNG)');
      return;
    }

    // Validar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Passar o arquivo para o componente pai
    console.log('✅ Passando arquivo para componente pai:', file);
    onImageSelect(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div className={styles.uploadContainer}>
      <div 
        className={`${styles.uploadArea} ${preview ? styles.hasImage : ''}`}
        onClick={handleImageClick}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.overlay}>
              <FiCamera className={styles.cameraIcon} />
              <span className={styles.changeText}>Trocar foto</span>
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemoveImage}
              aria-label="Remover foto"
            >
              <FiX size={18} />
            </button>
          </>
        ) : (
          <div className={styles.placeholder}>
            <FiCamera className={styles.cameraIconLarge} />
            <span className={styles.placeholderText}>Adicionar foto</span>
            <span className={styles.placeholderSubtext}>Clique para selecionar</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleImageChange}
        className={styles.fileInput}
        aria-label="Upload de imagem"
      />

      {error && <p className={styles.errorMessage}>{error}</p>}
      
      <p className={styles.helperText}>
        Formatos: JPG, PNG • Máximo {maxSizeMB}MB
      </p>
    </div>
  );
}
