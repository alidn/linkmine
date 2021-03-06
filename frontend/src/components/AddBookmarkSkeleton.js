import React, {useState, useCallback, useContext} from 'react';
import {saveBookmark} from '../api/bookmarks';
import SpinnerCircle from './SpinnerCircle';
import {motion} from 'framer-motion';
import {useNotification} from './notification';
import {useRecoilValue} from 'recoil/dist';
import {currentGroupIDState} from './Groups';
import {ThemeContext} from '../App';

let CloseIcon = React.lazy(() => import('./icons/close'));

export default function AddBookmarkSkeleton({handleSave}) {
  const group = useRecoilValue(currentGroupIDState);

  let [isAdding, setAdding] = useState(false);
  let [url, setUrl] = useState('');
  let [description, setDescription] = useState('');
  let [title, setTitle] = useState('');
  let [loading, setLoading] = useState(false);
  let [tags, setTags] = useState(['']);
  let showNotification = useNotification();
  let {dark} = useContext(ThemeContext);

  const handleTagDelete = (index) => {
    setTags((prevTags) => prevTags.filter((_value, idx) => idx !== index));
  };

  const handleTagChange = (e) => {
    let value = e.target.value;
    if (value.endsWith(' ')) {
      // TODO: remove duplicates.
      setTags((prevTag) => prevTag.concat([value.slice(0, value.length - 1)]));
      e.target.value = '';
    }
  };

  const save = () => {
    if (url === '' || title === '') {
      showNotification('Url or title cannot be empty', 'error', 2000);
      return;
    }
    setLoading(true);
    saveBookmark({url, description, group, title, tags}).then((data) => {
      setLoading(false);
      setAdding(false);
      data.json().then((newBookmark) => {
        handleSave(newBookmark);
      });
    });
  };

  const cancel = () => setAdding((v) => !v);

  let titleInputRef = useCallback((node) => {
    if (node) {
      node.focus();
    }
  }, []);
  const variants = {
    hidden: {scale: 0.7},
    visible: {scale: 1},
  };

  return isAdding ? (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{duration: 0.1}}
      className={`bg-gray-100 rounded-lg mt-5 pt-5 pb-5 mb-3`}>
      <input
        onChange={(e) => setTitle(e.target.value)}
        ref={titleInputRef}
        style={{width: '80%'}}
        className="m-3 bg-white focus:outline-none focus:border-indigo-400 border border-gray-300 rounded py-2 px-4 block appearance-none leading-normal"
        type="text"
        placeholder="title"
      />
      <input
        onChange={(e) => setUrl(e.target.value)}
        style={{width: '60%'}}
        className="m-3 bg-white focus:outline-none focus:border-indigo-400 border border-gray-300 rounded py-2 px-4 block appearance-none leading-normal"
        type="text"
        placeholder="url"
      />
      <div className={`m-4 text-gray-700`}>
        <span>Tags (separated by space): </span>
        <input
          onChange={handleTagChange}
          type={'text'}
          placeholder={`tagname`}
          className={`bg-white w-24 focus:outline-none focus:border-indigo-400 border border-gray-300 rounded p-2 appearance-none leading-normal`}
        />
        {tags.map((tag, index) => (
          <Tag
            handleDelete={handleTagDelete}
            key={index}
            index={index}
            tagName={tag}
          />
        ))}
      </div>
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{width: '80%'}}
        className="m-3 bg-white focus:outline-none focus:border-indigo-400 border border-gray-300 rounded py-2 w-3/4 px-4 block appearance-none leading-normal"
        placeholder="description"
      />
      <button
        style={{
          color: dark ? '' : '#1a73e8',
          minWidth: '4rem',
          maxWidth: '8rem',
        }}
        className={`
        m-3
        ${dark ? 'bg-gray-600' : ''} py-1 px-2 rounded   focus:outline-none ${
          dark ? 'text-gray-400' : ''
        }
          ${dark ? 'hover:bg-red-200' : 'hover:bg-gray-200'}
          ${dark ? '' : 'focus:bg-gray-300'}
          
          `}
        onClick={save}>
        {loading ? (
          <div className={`flex flex-row`}>
            Save
            <SpinnerCircle />
          </div>
        ) : (
          'Save'
        )}
      </button>
      <button
        style={{
          color: dark ? '' : '#1a73e8',
          minWidth: '4rem',
          maxWidth: '8rem',
        }}
        className={`
        m-3
        ${dark ? 'bg-gray-600' : ''} py-1 px-2 rounded   focus:outline-none ${
          dark ? 'text-gray-400' : ''
        }
          ${dark ? 'hover:bg-red-200' : 'hover:bg-gray-200'}
          ${dark ? '' : 'focus:bg-gray-300'}
          
          `}
        onClick={cancel}>
        Cancel
      </button>
    </motion.div>
  ) : (
    <motion.div
      whileTap={{scale: 0.9}}
      onClick={() => setAdding(true)}
      className="p-3 mt-5 mb-3 rounded focus:bg-gray-200 hover:bg-gray-100 cursor-pointer border border-gray-600 border-dashed text-center">
      <p className="text-xl text-gray-600">Add Bookmark + </p>
    </motion.div>
  );
}

export function Tag({tagName, handleDelete, index, tagId, dark}) {
  return (
    <span
      style={{borderRadius: '2em', maxWidth: '50px'}}
      className={`m-2 ${tagName === '' && 'hidden'} border inline text-sm ${
        dark ? 'border-red-400' : 'border-indigo-400'
      } py-1 px-3
      ${dark ? 'text-gray-200' : 'text-gray-700'}
      `}>
      <span className={`hover:underline cursor-pointer`}>{tagName}</span>
      <span
        onClick={() => handleDelete(index, tagId)}
        className={`cursor-pointer`}>
        <CloseIcon width={18} height={18} />
      </span>
    </span>
  );
}
