import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="flex">
      <Button size="xs" variant="primary">
        Primary
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="destructive">
        Destructive
      </Button>
      <Button variant="ghost">
        Ghost
      </Button>
      <Button variant="muted">
        Muted
      </Button>
      <Button variant="teritary">
        teritary
      </Button>
    </div>
  )

  ;
}
