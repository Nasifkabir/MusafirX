import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, FileText, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent" size="lg">
          <PlusCircle className="h-5 w-5 mr-3" />
          New Booking
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <Users className="h-5 w-5 mr-3" />
          Manage Customers
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <FileText className="h-5 w-5 mr-3" />
          Generate Report
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </div>
    </Card>
  )
}
