import './index.css'
import iframecode from './404'

const NotFound = function() {
    return (
        <>
            <div dangerouslySetInnerHTML={{__html: iframecode}}/>
        </>
    )
}

export default NotFound