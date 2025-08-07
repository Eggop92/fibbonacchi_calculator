import { Component } from "react";

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ""
    }

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    fetchValues = async () => {
        const values = await axios.get('api/values/current');
        this.setState({ values: values.data });
    };

    fetchIndexes = async () => {
        const seenIndexes = await axios.get('api/values/all');
        this.setState({ seenIndexes: seenIndexes.data });
    };
}