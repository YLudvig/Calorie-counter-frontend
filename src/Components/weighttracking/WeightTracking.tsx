import type { User } from "../../types/AuthTypes";
import Sidebar from "../sidebar/Sidebar";

type WeightTrackingProps = {
    user: User;
    setUser: (user: User | null) => void;
}

export default function WeightTracking({ user, setUser }: WeightTrackingProps) {


    return (
        <div className="flex h-screen w-screen">
            <Sidebar user={user} setUser={setUser} />
            <div className="flex-grow p-6 overflow-auto rounded-lg flex flex-col items-center">
                <div className="overflow-x-auto rounded-sm border border-gray-300">
                    <table className="min-w-full table-fixed border border-gray-400 text-sm">
                        <tbody>
                            <tr>Hej</tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
