import { Avatar } from "antd";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

type IPostProps = {
  content: string;
  setContent: (value: string) => void;
  postSubmit: React.MouseEventHandler<HTMLButtonElement>;
  handleImage: React.ChangeEventHandler<HTMLInputElement>;
  uploading: boolean;
  image: {
    url?: string;
  };
};

const CreatePostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,
  image,
}: IPostProps) => {
  return (
    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Write something..."
          ></textarea>
        </form>
      </div>

      <div className="card-footer d-flex justify-content-between text-muted">
        <button
          disabled={!content}
          onClick={postSubmit}
          className="btn btn-primary btn-sm mt-1"
        >
          Post
        </button>
        <label>
          {image && image.url ? (
            <Avatar size={40} src={image.url} className="mt-1" />
          ) : uploading ? (
            <LoadingOutlined className="mt-2" />
          ) : (
            <CameraOutlined className="mt-2" />
          )}
          <input onChange={handleImage} type="file" accept="images/*" hidden />
        </label>
      </div>
    </div>
  );
};

export default CreatePostForm;
