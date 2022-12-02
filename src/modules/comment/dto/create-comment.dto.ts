export default class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public publicationDate!: Date;
  public userId!: string;
  public filmId!: string;
}
