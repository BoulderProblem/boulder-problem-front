import apple from '../../assets/apple.svg';
import google from '../../assets/google.svg';

interface StoreButtonProps {
  store: 'apple' | 'google';
  className?: string;
}

export function StoreButton({ store }: StoreButtonProps) {
  const icon = store === 'apple' ? apple : google;
  const url =
    store === 'apple'
      ? 'https://apps.apple.com/us/app/lets-drink/id1509347316?l=fr&ls=1'
      : 'https://play.google.com/store/apps/details?id=io.chabs.apero';

  return (
    <a href={url} className="m-auto">
      <img src={icon} alt="Grimpeur en action" className="object-cover h-14" />
    </a>
  );
}
