import { User } from '@one-cart/common';

export const getUser = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { new: true },
    ).select(['-password', '-__v', '-createdAt', '-updatedAt']);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
