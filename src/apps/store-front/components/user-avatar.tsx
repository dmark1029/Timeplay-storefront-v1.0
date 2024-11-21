import { useEffect, useState } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { ContentAvatarData } from 'ships-service-sdk';
import { avatarIdDescMap } from '@/utils/util';
import { contentApi } from '@/services/ships-service';

type userAvatarProps = {
  prevAvatar?: ContentAvatarData;
  scrollHeight?: string;
  onConfirmation: (avatar: ContentAvatarData) => void;
  onClose: () => void;
};

const UserAvatar: React.FC<userAvatarProps> = ({
  prevAvatar,
  scrollHeight,
  onConfirmation,
  onClose,
}) => {
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [avatars, setAvatars] = useState<ContentAvatarData[]>([]);
  const handleImageClick = (index: number) => {
    setSelectedAvatarIndex(index === selectedAvatarIndex ? null : index);
  };
  const saveImage = () => {
    if (selectedAvatarIndex !== null) {
      const selectedAvatar = avatars[selectedAvatarIndex];
      onConfirmation(selectedAvatar);
      onClose();
    }
  };

  const getAvatarDescription = (url: any, index: number): string => {
    const match = url.match(/avatar-\d+/);
    if (match) {
      const description = avatarIdDescMap.get(match[0]);
      return description ? description : `User Avatar ${index}`;
    }
    return `User Avatar ${index}`;
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarResp = await contentApi.getAvatars();
      setAvatars(avatarResp.data.data || []);
    };

    fetchAvatars();
  }, []);

  return (
    <div className='flex w-full justify-center'>
      <div className='flex max-w-fit flex-col gap-2'>
        <Card isBlurred className='' shadow='sm'>
          <CardBody className='bg-gray-200'>
            <div
              role="group"
              aria-labelledby="choose-heading"
              className='scrollable-card-list'
              style={{
                height: `${scrollHeight || '30vh'}`,
                overflowY: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              <p id="choose-heading">Choose your avatar below</p>
              <ul className="flex flex-wrap justify-between gap-2">
                {avatars.map((avatar, index) => {
                  return (
                    <li key={index} className="mt-4">
                      <button
                        className={`relative border-2 ${selectedAvatarIndex === index ? 'border-black' : ''
                          } ${prevAvatar?.id === avatar.id && selectedAvatarIndex !== index
                            ? 'rounded-full border-2 border-black'
                            : ''
                          }`}
                        onClick={() => handleImageClick(index)}
                        aria-label={`Select avatar ${index}`}
                      >
                        <img
                          className="h-16 w-16 cursor-pointer rounded-full object-cover"
                          src={avatar.url}
                          alt={getAvatarDescription(avatar.url, index)}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardBody>
        </Card>
        {
          selectedAvatarIndex !== null && (
            <Button
              className="h-10 my-4 w-full bg-gradient-to-r from-user-menu-blue-gradient-dark to-user-menu-blue-gradient-light font-bold text-white"
              onClick={saveImage}
            >
              Apply
            </Button>
          )}
      </div>
    </div>
  );
};

export default UserAvatar;
