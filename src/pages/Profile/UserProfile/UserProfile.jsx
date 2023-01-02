import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/context';
import Nav from '../../../components/Nav/Nav';
import ProductWrapp from '../../../components/common/Product/ProductWrapp';
import TabMenu from '../../../components/common/TabMenu/TabMenu';
import ProfileInfo from '../../../components/ProfileInfo/ProfileInfo';
import MenuBar from '../../../components/MenuBar/MenuBar';
import PostCard from '../../../components/common/PostCard/PostCard';
import PostAlbum from '../../../components/common/PostAlbum/PostAlbum';
import * as S from './StyledUserProfile';
import FetchApi from '../../../api';
// import PostAlbum from '../../../components/common/PostAlbum/PostAlbum';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const authAccountName = user.accountname;
  const [userProfile, setUserProfile] = useState(null);
  const [userPostArr, setUserPostArr] = useState([]);
  const [userAlbumPostArr, setUserAlbumPostArr] = useState([]);
  const [list, setList] = useState(true);
  const location = useLocation();
  const pageAccount = location.pathname.split('/')[2];
  const BASE_URL = 'https://mandarin.api.weniv.co.kr';

  useEffect(() => {
    if (!userProfile) {
      const getUserProfileInfo = async () => {
        const data = await FetchApi.getUserInfo(user.token, pageAccount);
        setUserProfile(data.profile);
      };
      getUserProfileInfo();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userPostArr.length) {
      const getMyPost = async () => {
        const url = `${BASE_URL}/post/${pageAccount}/userpost`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-type': 'application/json',
          },
        });
        const data = await response.json();
        setUserPostArr(data.post);
        const newdata = data.post.filter((post) => post.image !== '');
        setUserAlbumPostArr(newdata);
      };
      getMyPost();
    }
  }, []);

  const onListToggle = () => {
    setList(!list);
  };

  return (
    <S.Container>
      <Nav type='home' />
      <S.MainWrap>
        {userProfile ? (
          <ProfileInfo
            userProfile={userProfile}
            authAccountName={authAccountName}
          />
        ) : (
          <p>로딩중입니다...</p>
        )}
        <ProductWrapp pageAccount={pageAccount} />
        <MenuBar list={list} onListToggle={onListToggle} />
        {/* eslint-disable-next-line no-nested-ternary */}
        {userPostArr.length ? (
          list ? (
            <S.PostCardWrap>
              {userPostArr.map((item) => (
                <PostCard key={item.id} data={item} />
              ))}
            </S.PostCardWrap>
          ) : (
            <S.ProfilePostAlbumWrap>
              {userAlbumPostArr.map((item, index) => (
                <PostAlbum key={item.id} data={item} index={index} />
              ))}
            </S.ProfilePostAlbumWrap>
          )
        ) : (
          <>로딩중입니다...</>
        )}
      </S.MainWrap>
      <TabMenu />
    </S.Container>
  );
};

export default UserProfile;
