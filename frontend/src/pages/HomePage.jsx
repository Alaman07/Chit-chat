import { useChatStore } from "../store/useChatStore"
import Sidebar from '../components/Sidebar.jsx'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'

const HomePage = () => {
    const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            <Sidebar />

            {!selectedUser? <NoChatSelected /> : <ChatContainer />}
<<<<<<< HEAD
            
=======
>>>>>>> c4f6599caf5f4ac015c5b4b34915cf535624d375

          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage
