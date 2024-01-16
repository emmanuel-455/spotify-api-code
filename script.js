
    const client_id = '04e5f488563f453a9550ff94b3d6295b';
    const client_secret = '9d5fdd0210a645ea998cf0e282efa020';
    const refresh_token = 'AQCDLSpBDbnkawxB4Ralg-zCbIm5cWlrQa_pB5uxfKcpE6J_ahaqL6E8V2ldheNsIxXwD0-o1sjs0DaUWZTvLqJOni34V9PgCFkL9sguDY70X0XxANkschvqODnP2pCTaaY';

    let access_token;

    function getAccessToken() {
    return fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`)
      },
    body: 'grant_type=refresh_token&refresh_token=' + refresh_token
    })
    .then(response => response.json())
    .then(data => {
        access_token = data.access_token;
    setTimeout(getAccessToken, (data.expires_in - 60) * 1000); // Refresh token 60 seconds before it expires
    return access_token;
    })
    .catch(error => {
        console.error(error);
    document.getElementById('song').innerHTML = 'Error fetching song information';
    });
  }

    function getSongInfo() {
    return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    .then(response => {
      if (response.status === 204) {
        // If there is no currently playing track, get the most recently played track instead
        return fetch('https://api.spotify.com/v1/me/player/recently-played', {
        headers: {
        'Authorization': `Bearer ${access_token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.items.length > 0) {
            const lastPlayed = data.items[0].track;
    return {
        songName: lastPlayed.name,
    songArtist: lastPlayed.artists[0].name,
    songImageUrl: lastPlayed.album.images[0].url,
    songUrl: lastPlayed.external_urls.spotify
            };
          } else {
            // If there are no recently played tracks either, show an error message
            throw new Error('No recently played tracks found');
          }
        });
      } else {
        return response.json()
        .then(data => {
          return {
        songName: data.item.name,
    songArtist: data.item.artists[0].name,
    songImageUrl: data.item.album.images[0].url,
    songUrl: data.item.external_urls.spotify
          };
        });
      }
    })
    .catch(error => {
        console.error(error);
    document.getElementById('song').innerHTML = 'Error fetching song information';
    });
  }

    function updateSongInfo() {
        getAccessToken()
            .then(() => {
                return getSongInfo();
            })
            .then(songInfo => {
                const songHtml = `
        <a href="${songInfo.songUrl}" target="_blank" style="display: flex; align-items: center;">
          <img src="${songInfo.songImageUrl}" alt="${songInfo.songName} album cover" width="50" style="margin-right: 10px;">
          <div style="display: flex; flex-direction: column; justify-content: center; line-height: 1.2;">
            <span style="font-weight: bold;">${songInfo.songName}</span>
            <span style="font-size: 12px;">${songInfo.songArtist}</span>
          </div>
        </a>`;
                document.getElementById('song').innerHTML = songHtml;
                setTimeout(updateSongInfo, 10000); // Update every 10 seconds
            });
  }

    updateSongInfo();



