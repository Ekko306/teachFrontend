// https://miragejs.com/quickstarts/react/develop-an-app/

import { createServer, Model } from "miragejs"

export function makeServer({ environment = "test" } = {}) {
    let server = createServer({
        environment,

        models: {
            student: Model,
        },

        seeds(server) {
            server.create("student", { name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "Alice", intro: '我叫Alice很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "Alice", intro: '我叫Alice很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "Alice", intro: '我叫Alice很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "Alice", intro: '我叫Alice很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
            server.create("student", { name: "Alice", intro: '我叫Alice很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' })
        },

        routes() {
            this.namespace = "api"

            this.get("/students", (schema, request) => {
                let current = request.queryParams.current
                if(current === "1") {
                    return JSON.stringify({
                        data: [
                            { id: "1", name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "2", name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "3", name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "4", name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "5", name: "yp", intro: '我叫yp很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                        ],
                        total: 10,
                        page: 1,
                        success: true
                    })
                } else {
                    return JSON.stringify({
                        data: [
                            { id: "6", name: "my", intro: '我叫my很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "7", name: "my", intro: '我叫my很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "8", name: "my", intro: '我叫my很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "9", name: "my", intro: '我叫my很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                            { id: "10", name: "my", intro: '我叫my很开心', avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
                        ],
                        total: 10,
                        page: 2,
                        success: true
                    })
                }


            })
        },
    })

    return server
}