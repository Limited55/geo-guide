import Alert from "./alert"
import Footer from "./footer"
import Meta from "./meta"

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen max-w-5xl mx-auto">
        {/* <Alert preview={preview} /> */}
        <main>{children}</main>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
