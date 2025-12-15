import { useEffect, useState } from 'react';

let avatarCache: Record<string, string> = {};

const baseUrl = import.meta.env.VITE_URL;

export function useAvatar(
  id: string,
  avatarName: string,
  token: string,
  kind: string
) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!avatarName) return;

    if (avatarCache[kind + '_' + id]) {
      setUrl(avatarCache[kind + '_' + id]);
      return;
    }

    let isMounted = true;

    const load = async () => {
      let url = '';
      if (kind === 'place') {
        url = `${baseUrl}/places/${id}/logo?size=100`;
      }
      if (kind === 'way') {
        url = `${baseUrl}/ways/${id}/image?size=500`;
        console.log(url);
      }
      if (kind === 'user') {
        url = `${baseUrl}/users/${id}/avatar/${avatarName}?size=100`;
      }

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Erreur chargement avatar');

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          avatarCache[kind + '_' + id] = objectUrl;
          setUrl(objectUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id, avatarName, token]);

  return url;
}
