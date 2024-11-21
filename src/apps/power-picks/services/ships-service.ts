import axios, { AxiosResponse } from 'axios';

import { Draw, Line, DrawResponse } from '../types';

const powerpicks_service = {
  getP3Draws(): Promise<Draw[]> {
    return new Promise((res) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/ships-service/ships/lottery/powerpick/draw/upcoming/pick3',
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          let draws = response.data;

          for (let i in draws.data) {
            draws.data[i].draw_time = new Date(draws.data[i].draw_time);
          }

          res(draws.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },

  getP4Draws(): Promise<Draw[]> {
    return new Promise((res) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/ships-service/ships/lottery/powerpick/draw/upcoming/pick4',
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          let draws = response.data;

          for (let i in draws.data) {
            draws.data[i].draw_time = new Date(draws.data[i].draw_time);
          }
          res(draws.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },

  getTickets(userID: string, token: string, drawID: number): Promise<any[]> {
    return new Promise((res) => {
      axios
        .get(`/ships-service/ships/lottery/powerpick/draw/${drawID}/user/${userID}/ticket`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          res(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },

  getDrawById(drawID: number): Promise<AxiosResponse<DrawResponse>> {
    return new Promise((res) => {
      axios
        .get<DrawResponse>(`/ships-service/ships/lottery/powerpick/draw/${drawID}`)
        .then((response) => {
          res(response);
        })
        .catch((error) => {
          res(error.response);
        });
    });
  },

  getUserParticipatingDraws(userID: string, token: string, pickType: string): Promise<Draw[]> {
    return new Promise((res) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/ships-service/ships/lottery/powerpick/draw/participating/${pickType}/user/${userID}?upcomingOnly=false`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          let draws = response.data;

          for (let i in draws.data) {
            draws.data[i].draw_time = new Date(draws.data[i].draw_time);
          }

          res(draws.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },

  getLineByID(userID: string, lineID: number, token: string): Promise<Line> {
    return new Promise((res) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/ships-service/ships/lottery/powerpick/user/${userID}/line/${lineID}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          res(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
};

export { powerpicks_service as ships_service };
